import { describe, expect, it } from "vitest";
import {
  finalizeOutfits,
  InvalidOutfitsError,
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
    expect(() => finalizeOutfits({ outfits })).toThrow(InvalidOutfitsError);
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
    expect(OutfitsRequestSchema.parse({ event: "  date night  " }).event).toBe("date night");
    expect(OutfitsRequestSchema.safeParse({ event: "   " }).success).toBe(false);
    expect(OutfitsRequestSchema.safeParse({ event: "x".repeat(301) }).success).toBe(false);
  });
});
