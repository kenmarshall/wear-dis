import { describe, expect, it } from "vitest";
import { pieceIconKind } from "@/lib/pieceIcons";

describe("pieceIconKind", () => {
  it("maps clothing slots directly", () => {
    expect(pieceIconKind({ slot: "top", name: "Graphic band tee" })).toBe("top");
    expect(pieceIconKind({ slot: "dress", name: "Satin slip midi dress" })).toBe("dress");
    expect(pieceIconKind({ slot: "outerwear", name: "Slim-fit wool blazer" })).toBe("outerwear");
  });

  it("distinguishes skirts from trousers and boots from shoes", () => {
    expect(pieceIconKind({ slot: "bottom", name: "A-line mini skirt" })).toBe("skirt");
    expect(pieceIconKind({ slot: "bottom", name: "Tailored wool trousers" })).toBe("bottom");
    expect(pieceIconKind({ slot: "footwear", name: "Lace-up combat boots" })).toBe("boot");
    expect(pieceIconKind({ slot: "footwear", name: "Leather penny loafers" })).toBe("shoe");
  });

  it("picks accessory types from the name, first match wins", () => {
    expect(pieceIconKind({ slot: "accessory", name: "Minimalist watch with leather strap" })).toBe("watch");
    expect(pieceIconKind({ slot: "accessory", name: "Chain strap mini bag" })).toBe("bag");
    expect(pieceIconKind({ slot: "accessory", name: "Leather dress belt" })).toBe("belt");
    expect(pieceIconKind({ slot: "accessory", name: "Silk necktie" })).toBe("tie");
    expect(pieceIconKind({ slot: "accessory", name: "Wool beanie hat" })).toBe("hat");
    expect(pieceIconKind({ slot: "accessory", name: "Silver hoop earrings" })).toBe("jewelry");
    expect(pieceIconKind({ slot: "accessory", name: "Foam earplugs" })).toBe("accessory");
  });
});
