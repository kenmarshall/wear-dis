import { z } from "zod";

export const OUTFIT_COUNT = 5;
export const EVENT_MAX_LENGTH = 300;
const MAX_ANSWERS = 10;
export const MAX_QUESTIONS = 4;
export const MAX_OPTIONS = 5;
const MIN_OPTIONS = 2;
const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;

export const PIECE_SLOTS = [
  "top",
  "bottom",
  "dress",
  "outerwear",
  "footwear",
  "accessory",
] as const;

export const GENDERS = ["men", "women"] as const;

// Shapes Claude must return. Kept free of length/regex constraints so they
// translate cleanly to structured-output JSON schemas; finalizeOutfits enforces the rest.
export const PieceSchema = z.object({
  slot: z.enum(PIECE_SLOTS),
  name: z.string(),
  colorName: z.string(),
  colorHex: z.string(),
  searchTerms: z.string(),
});

export const OutfitSchema = z.object({
  rank: z.number().int(),
  name: z.string(),
  summary: z.string(),
  whyOccasion: z.string(),
  whyColors: z.string(),
  pieces: z.array(PieceSchema),
});

export const OutfitsResponseSchema = z.object({
  outfits: z.array(OutfitSchema),
});

export const QuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  options: z.array(z.string()),
});

export const QuestionsResponseSchema = z.object({
  usable: z.boolean(),
  guidance: z.string().nullable(),
  exampleEvent: z.string().nullable(),
  questions: z.array(QuestionSchema),
});

export const GenderSchema = z.enum(GENDERS);

export const AnswerSchema = z.object({
  question: z.string().trim().min(1),
  answer: z.string().trim().min(1),
});

const EventSchema = z.string().trim().min(1).max(EVENT_MAX_LENGTH);

export const QuestionsRequestSchema = z.object({
  event: EventSchema,
});

export const OutfitsRequestSchema = z.object({
  event: EventSchema,
  gender: GenderSchema,
  answers: z.array(AnswerSchema).max(MAX_ANSWERS),
});

export type Piece = z.infer<typeof PieceSchema>;
export type Outfit = z.infer<typeof OutfitSchema>;
export type OutfitsResponse = z.infer<typeof OutfitsResponseSchema>;
export type Gender = z.infer<typeof GenderSchema>;
export type Answer = z.infer<typeof AnswerSchema>;
export type OutfitsRequest = z.infer<typeof OutfitsRequestSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type QuestionsResponse = z.infer<typeof QuestionsResponseSchema>;
export type QuestionsRequest = z.infer<typeof QuestionsRequestSchema>;

export class InvalidOutputError extends Error {}

export function isHexColor(value: string): boolean {
  return HEX_COLOR_PATTERN.test(value);
}

/**
 * Turns Claude's parsed output into the guaranteed shape the page relies on:
 * exactly OUTFIT_COUNT outfits, sorted best-first, ranks renumbered 1..N.
 */
export function finalizeOutfits(raw: OutfitsResponse): OutfitsResponse {
  const usable = raw.outfits.filter((outfit) => outfit.pieces.length > 0);
  if (usable.length < OUTFIT_COUNT) {
    throw new InvalidOutputError(
      `Expected ${OUTFIT_COUNT} outfits with pieces, got ${usable.length}`,
    );
  }
  const outfits = [...usable]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, OUTFIT_COUNT)
    .map((outfit, index) => ({ ...outfit, rank: index + 1 }));
  return { outfits };
}

/**
 * Normalizes Claude's questions: usable answers get 1..MAX_QUESTIONS questions,
 * each with MIN_OPTIONS..MAX_OPTIONS distinct options; unusable answers carry guidance.
 */
export function finalizeQuestions(raw: QuestionsResponse): QuestionsResponse {
  if (!raw.usable) {
    return { usable: false, guidance: raw.guidance, exampleEvent: raw.exampleEvent, questions: [] };
  }
  const questions = raw.questions
    .map((question) => ({
      ...question,
      text: question.text.trim(),
      options: [...new Set(question.options.map((option) => option.trim()).filter(Boolean))].slice(
        0,
        MAX_OPTIONS,
      ),
    }))
    .filter((question) => question.text.length > 0 && question.options.length >= MIN_OPTIONS)
    .slice(0, MAX_QUESTIONS)
    .map((question, index) => ({ ...question, id: `q${index + 1}` }));
  if (questions.length === 0) {
    throw new InvalidOutputError("Claude marked the event usable but returned no usable questions");
  }
  return { usable: true, guidance: null, exampleEvent: null, questions };
}
