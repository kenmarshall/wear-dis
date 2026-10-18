import { isHexColor, type Outfit } from "@/lib/schemas";
import { STRINGS } from "@/lib/strings";
import styles from "./OutfitCard.module.css";

interface Props {
  outfit: Outfit;
}

export function OutfitCard({ outfit }: Props) {
  const isBest = outfit.rank === 1;

  return (
    <article className={isBest ? `${styles.card} ${styles.best}` : styles.card}>
      <header className={styles.header}>
        <span className={styles.rank}>
          {isBest ? STRINGS.results.bestPick : STRINGS.results.rankLabel(outfit.rank)}
        </span>
        <h2 className={styles.name}>{outfit.name}</h2>
        <p className={styles.summary}>{outfit.summary}</p>
      </header>

      <ul className={styles.pieces} aria-label={STRINGS.results.piecesLabel}>
        {outfit.pieces.map((piece, index) => (
          <li key={`${piece.slot}-${index}`} className={styles.piece}>
            <span
              className={styles.swatch}
              style={isHexColor(piece.colorHex) ? { backgroundColor: piece.colorHex } : undefined}
              role="img"
              aria-label={STRINGS.results.swatchLabel(piece.colorName)}
            />
            <span className={styles.pieceText}>
              <span className={styles.slot}>{STRINGS.slots[piece.slot]}</span>
              <span>
                {piece.colorName} {piece.name.toLowerCase()}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <div className={styles.why}>
        <h3 className={styles.whyHeading}>{STRINGS.results.whyOccasion}</h3>
        <p>{outfit.whyOccasion}</p>
        <h3 className={styles.whyHeading}>{STRINGS.results.whyColors}</h3>
        <p>{outfit.whyColors}</p>
      </div>
    </article>
  );
}
