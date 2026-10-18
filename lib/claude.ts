import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { buildOutfitsUserMessage, OUTFITS_SYSTEM_PROMPT } from "./prompts";
import {
  finalizeOutfits,
  OutfitsResponseSchema,
  type OutfitsRequest,
  type OutfitsResponse,
} from "./schemas";

// Server-only: imported by API routes, never by client components.

const MODEL = "claude-opus-5-5";
const MAX_TOKENS = 16000;
const FALLBACK_BETA = "server-side-fallback-2026-07-01";

export type AdvisorErrorCode = "missing_key" | "refusal" | "invalid_output";

export class AdvisorError extends Error {
  constructor(
    readonly code: AdvisorErrorCode,
    message: string,
  ) {
    super(message);
  }
}

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new AdvisorError("missing_key", "ANTHROPIC_API_KEY is not set in .env.local");
  }
  client ??= new Anthropic();
  return client;
}

export async function getOutfits(input: OutfitsRequest): Promise<OutfitsResponse> {
  const response = await getClient().beta.messages.parse({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    betas: [FALLBACK_BETA],
    fallbacks: "default",
    system: OUTFITS_SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildOutfitsUserMessage(input) }],
    output_config: {
      effort: "medium",
      format: betaZodOutputFormat(OutfitsResponseSchema),
    },
  });

  if (response.stop_reason === "refusal") {
    throw new AdvisorError("refusal", "Claude declined the outfits request");
  }
  if (!response.parsed_output) {
    throw new AdvisorError("invalid_output", `No parsed output (stop_reason: ${response.stop_reason})`);
  }
  return finalizeOutfits(response.parsed_output);
}
