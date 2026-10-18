import { describe, expect, it } from "vitest";
import {
  finalizeOutfits,
  finalizeQuestions,
  InvalidOutputError,
  isHexColor,
  OutfitsRequestSchema,
  type Outfit,
} from "@/lib/schemas";

function outfit(rank: number, pieceCount = 3): Outfit {
  return {
    rank,
    name: `Look ${rank}`,
    summary: "summary",
    whyOccasion: "why occasion",
    whyColors: "why colors",
    pieces: Array.from({ length: pieceCount }, () => ({
      slot: "top" as const,
      name: "Shirt",
      colorName: "Navy",
      colorHex: "#1F2A44",
      searchTerms: "shirt",
    })),
  };
}

describe("finalizeOutfits", () => {
  it("sorts by rank and renumbers 1..5", () => {
    const result = finalizeOutfits({ outfits: [outfit(9), outfit(2), outfit(5), outfit(1), outfit(3)] });
    expect(result.outfits.map((o) => o.rank)).toEqual([1, 2, 3, 4, 5]);
    expect(result.outfits.map((o) => o.name)).toEqual(["Look 1", "Look 2", "Look 3", "Look 5", "Look 9"]);
  });

  it("keeps only the top five when Claude returns more", () => {
    const result = finalizeOutfits({ outfits: [1, 2, 3, 4, 5, 6].map((r) => outfit(r)) });
    expect(result.outfits).toHaveLength(5);
    expect(result.outfits.at(-1)?.name).toBe("Look 5");
  });

  it("rejects fewer than five usable outfits", () => {
    const outfits = [outfit(1), outfit(2), outfit(3), outfit(4), outfit(5, 0)];
    expect(() => finalizeOutfits({ outfits })).toThrow(InvalidOutputError);
  });
});

describe("isHexColor", () => {
  it("accepts #RRGGBB and rejects anything else", () => {
    expect(isHexColor("#1F2A44")).toBe(true);
    expect(isHexColor("navy")).toBe(false);
    expect(isHexColor("#FFF")).toBe(false);
  });
});

describe("OutfitsRequestSchema", () => {
  it("trims the event and rejects empty or overlong input", () => {
    const base = { gender: "men", answers: [] };
    expect(OutfitsRequestSchema.parse({ ...base, event: "  date night  " }).event).toBe("date night");
    expect(OutfitsRequestSchema.safeParse({ ...base, event: "   " }).success).toBe(false);
    expect(OutfitsRequestSchema.safeParse({ ...base, event: "x".repeat(301) }).success).toBe(false);
  });

  it("requires gender and answers", () => {
    expect(OutfitsRequestSchema.safeParse({ event: "date" }).success).toBe(false);
    expect(OutfitsRequestSchema.safeParse({ event: "date", gender: "other", answers: [] }).success).toBe(false);
  });
});

describe("finalizeQuestions", () => {
  it("dedupes options, drops questions with fewer than two, caps at four and renumbers ids", () => {
    const result = finalizeQuestions({
      usable: true,
      guidance: null,
      exampleEvent: null,
      questions: [
        { id: "a", text: "Indoors or outdoors?", options: ["Indoors", "Indoors", " Outdoors "] },
        { id: "b", text: "Only one option", options: ["Yes"] },
        { id: "c", text: "Q3", options: ["1", "2"] },
        { id: "d", text: "Q4", options: ["1", "2"] },
        { id: "e", text: "Q5", options: ["1", "2"] },
        { id: "f", text: "Q6", options: ["1", "2"] },
      ],
    });
    expect(result.questions.map((q) => q.id)).toEqual(["q1", "q2", "q3", "q4"]);
    expect(result.questions[0].options).toEqual(["Indoors", "Outdoors"]);
    expect(result.questions.map((q) => q.text)).not.toContain("Only one option");
  });

  it("passes guidance through for unusable input and clears questions", () => {
    const result = finalizeQuestions({
      usable: false,
      guidance: "Tell me about an event",
      exampleEvent: "A friend's wedding",
      questions: [{ id: "x", text: "ignored", options: ["a", "b"] }],
    });
    expect(result).toEqual({
      usable: false,
      guidance: "Tell me about an event",
      exampleEvent: "A friend's wedding",
      questions: [],
    });
  });

  it("rejects a usable result with no usable questions", () => {
    expect(() =>
      finalizeQuestions({ usable: true, guidance: null, exampleEvent: null, questions: [] }),
    ).toThrow(InvalidOutputError);
  });
});
