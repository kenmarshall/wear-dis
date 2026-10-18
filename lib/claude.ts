import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { z } from "zod";
import {
  buildOutfitsUserMessage,
  buildQuestionsUserMessage,
  OUTFITS_SYSTEM_PROMPT,
  QUESTIONS_SYSTEM_PROMPT,
} from "./prompts";
import {
  finalizeOutfits,
  finalizeQuestions,
  OutfitsResponseSchema,
  QuestionsResponseSchema,
  type OutfitsRequest,
  type OutfitsResponse,
  type QuestionsResponse,
} from "./schemas";

// Server-only: imported by API routes, never by client components.

const MODEL = "claude-opus-5-5";
const MAX_TOKENS = 16000;
const FALLBACK_BETA = "server-side-fallback-2026-07-01";

type Effort = "low" | "medium";

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

async function askForJson<T>(
  system: string,
  userMessage: string,
  effort: Effort,
  schema: z.ZodType<T>,
): Promise<T> {
  const response = await getClient().beta.messages.parse({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    betas: [FALLBACK_BETA],
    fallbacks: "default",
    system,
    messages: [{ role: "user", content: userMessage }],
    output_config: { effort, format: betaZodOutputFormat(schema) },
  });

  if (response.stop_reason === "refusal") {
    throw new AdvisorError("refusal", "Claude declined the request");
  }
  if (!response.parsed_output) {
    throw new AdvisorError("invalid_output", `No parsed output (stop_reason: ${response.stop_reason})`);
  }
  return response.parsed_output;
}

export async function getQuestions(event: string): Promise<QuestionsResponse> {
  const raw = await askForJson(
    QUESTIONS_SYSTEM_PROMPT,
    buildQuestionsUserMessage(event),
    "low",
    QuestionsResponseSchema,
  );
  return finalizeQuestions(raw);
}

export async function getOutfits(input: OutfitsRequest): Promise<OutfitsResponse> {
  const raw = await askForJson(
    OUTFITS_SYSTEM_PROMPT,
    buildOutfitsUserMessage(input),
    "medium",
    OutfitsResponseSchema,
  );
  return finalizeOutfits(raw);
}
