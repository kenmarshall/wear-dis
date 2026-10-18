import { pieceIconKind, type PieceIconKind } from "@/lib/pieceIcons";
import { isHexColor, type Piece } from "@/lib/schemas";
import styles from "./PieceIllustration.module.css";

interface Props {
  piece: Piece;
}

// Each shape is drawn in a 48x48 box. "fill" shapes take the piece color;
// "line" shapes are outline-only details; "face" shapes use the surface color.
type ShapeRole = "fill" | "line" | "face";
type Shape = readonly [ShapeRole, string];

const SHAPES: Record<PieceIconKind, readonly Shape[]> = {
  top: [["fill", "M16 8 L10 11 L4 18 L9 23 L13 20 V42 H35 V20 L39 23 L44 18 L38 11 L32 8 C30 11 27 12 24 12 C21 12 18 11 16 8 Z"]],
  outerwear: [
    ["fill", "M17 6 L9 10 L5 40 H12 L14 22 V44 H34 V22 L36 40 H43 L39 10 L31 6 L24 20 Z"],
    ["line", "M24 20 V44 M17 6 L21 22 M31 6 L27 22"],
  ],
  bottom: [["fill", "M14 6 H34 L37 44 H27 L24 18 L21 44 H11 Z"], ["line", "M14 11 H34"]],
  skirt: [["fill", "M16 8 H32 L41 40 H7 Z"], ["line", "M16 13 H32"]],
  dress: [["fill", "M19 4 H29 L28 14 L38 44 H10 L20 14 Z"], ["line", "M20 14 H28"]],
  shoe: [["fill", "M4 30 C4 26 6 24 9 24 L20 26 C24 27 27 29 31 31 L40 33 C43 34 44 36 44 38 V40 H4 Z"]],
  boot: [["fill", "M12 6 H25 V28 L38 32 C42 33 44 36 44 40 V42 H12 Z"]],
  bag: [
    ["line", "M17 18 V14 C17 10 20 8 24 8 C28 8 31 10 31 14 V18"],
    ["fill", "M9 18 H39 L37 42 H11 Z"],
  ],
  watch: [["fill", "M19 4 H29 V44 H19 Z"], ["face", "M24 15 A9 9 0 1 1 23.99 15 Z"], ["line", "M24 19 V24 L27 26"]],
  belt: [["fill", "M4 20 H44 V28 H4 Z"], ["face", "M15 17 H25 V31 H15 Z"], ["line", "M20 24 H28"]],
  tie: [["fill", "M20 6 H28 L26 12 L31 38 L24 44 L17 38 L22 12 Z"]],
  hat: [["fill", "M14 34 C14 20 18 14 24 14 C30 14 34 20 34 34 Z"], ["fill", "M6 34 H42 C42 38 36 39 24 39 C12 39 6 38 6 34 Z"]],
  glasses: [
    ["fill", "M5 24 A8 7 0 1 0 21 24 A8 7 0 1 0 5 24 Z"],
    ["fill", "M27 24 A8 7 0 1 0 43 24 A8 7 0 1 0 27 24 Z"],
    ["line", "M21 23 C22 21 26 21 27 23"],
  ],
  scarf: [["fill", "M14 6 H34 V18 L30 44 H23 L25 18 H14 Z"], ["line", "M24 40 H31"]],
  jewelry: [["line", "M10 8 C10 26 38 26 38 8"], ["fill", "M24 23 L29 30 L24 38 L19 30 Z"]],
  accessory: [["fill", "M24 6 L40 20 L24 42 L8 20 Z"], ["line", "M8 20 H40 M18 6 L24 20 L30 6"]],
};

const ROLE_CLASS: Record<ShapeRole, string> = {
  fill: styles.fill,
  line: styles.line,
  face: styles.face,
};

export function PieceIllustration({ piece }: Props) {
  const color = isHexColor(piece.colorHex) ? piece.colorHex : undefined;
  return (
    <svg className={styles.icon} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      {SHAPES[pieceIconKind(piece)].map(([role, d], index) => (
        <path
          key={index}
          d={d}
          className={ROLE_CLASS[role]}
          style={role === "fill" && color ? { fill: color } : undefined}
        />
      ))}
    </svg>
  );
}
