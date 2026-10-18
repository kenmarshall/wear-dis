import type { Piece } from "./schemas";

export type PieceIconKind =
  | "top"
  | "bottom"
  | "skirt"
  | "dress"
  | "outerwear"
  | "shoe"
  | "boot"
  | "bag"
  | "watch"
  | "belt"
  | "tie"
  | "hat"
  | "glasses"
  | "scarf"
  | "jewelry"
  | "accessory";

// Checked in order: the first match wins ("chain strap bag" is a bag, not jewelry).
const ACCESSORY_KINDS: readonly [PieceIconKind, RegExp][] = [
  ["watch", /\bwatch/],
  ["bag", /\b(bag|clutch|tote|purse|backpack|satchel)\b/],
  ["belt", /\bbelt\b/],
  ["tie", /\b(tie|necktie|bow tie)\b/],
  ["hat", /\b(hat|cap|beanie|beret|fedora)\b/],
  ["glasses", /\b(glasses|sunglasses)\b/],
  ["scarf", /\b(scarf|shawl|pashmina)\b/],
  ["jewelry", /(necklace|earring|bracelet|\bring\b|choker|pendant|chain|cufflink|brooch|bangle)/],
];

export function pieceIconKind(piece: Pick<Piece, "slot" | "name">): PieceIconKind {
  const name = piece.name.toLowerCase();
  switch (piece.slot) {
    case "top":
    case "dress":
    case "outerwear":
      return piece.slot;
    case "bottom":
      return /\bskirt\b/.test(name) ? "skirt" : "bottom";
    case "footwear":
      return /\bboots?\b/.test(name) ? "boot" : "shoe";
    case "accessory":
      return ACCESSORY_KINDS.find(([, pattern]) => pattern.test(name))?.[0] ?? "accessory";
  }
}
