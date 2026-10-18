import { buildAmazonSearchUrl } from "@/lib/amazon";
import type { Gender, Outfit } from "@/lib/schemas";
import { STRINGS } from "@/lib/strings";
import { PieceIllustration } from "./PieceIllustration";
import styles from "./OutfitCard.module.css";

interface Props {
  outfit: Outfit;
  gender: Gender;
  expanded: boolean;
  onToggle: () => void;
}

export function OutfitCard({ outfit, gender, expanded, onToggle }: Props) {
  const isBest = outfit.rank === 1;
  const detailsId = `outfit-${outfit.rank}-details`;
  const cardClass = [styles.card, isBest && styles.best, expanded && styles.expanded]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClass}>
      <div className={styles.summaryArea} onClick={onToggle}>
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
              <PieceIllustration piece={piece} />
              <span className={styles.pieceText}>
                <span className={styles.slot}>{STRINGS.slots[piece.slot]}</span>
                <span>
                  {piece.colorName} {piece.name.toLowerCase()}
                </span>
                {expanded && (
                  <a
                    className={styles.shop}
                    href={buildAmazonSearchUrl(piece, gender)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={STRINGS.results.shopLabel(piece.colorName, piece.name.toLowerCase())}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {STRINGS.results.shop} ↗
                  </a>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {expanded && (
        <div id={detailsId} className={styles.why}>
          <h3 className={styles.whyHeading}>{STRINGS.results.whyOccasion}</h3>
          <p>{outfit.whyOccasion}</p>
          <h3 className={styles.whyHeading}>{STRINGS.results.whyColors}</h3>
          <p>{outfit.whyColors}</p>
        </div>
      )}

      <button
        type="button"
        className={styles.toggle}
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={detailsId}
      >
        {expanded ? STRINGS.results.collapse : STRINGS.results.expand}
      </button>
    </article>
  );
}
