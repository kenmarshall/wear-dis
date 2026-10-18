import type { Outfit } from "@/lib/schemas";
import { STRINGS } from "@/lib/strings";
import { OutfitCard } from "./OutfitCard";
import styles from "./OutfitList.module.css";

interface Props {
  outfits: Outfit[];
}

export function OutfitList({ outfits }: Props) {
  return (
    <section className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.heading}>{STRINGS.results.heading}</h1>
        <p className={styles.subheading}>{STRINGS.results.subheading}</p>
      </header>
      <ol className={styles.list}>
        {outfits.map((outfit) => (
          <li key={outfit.rank}>
            <OutfitCard outfit={outfit} />
          </li>
        ))}
      </ol>
    </section>
  );
}
