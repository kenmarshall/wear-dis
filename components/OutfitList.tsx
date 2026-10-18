"use client";

import { useState } from "react";
import type { Gender, Outfit } from "@/lib/schemas";
import { STRINGS } from "@/lib/strings";
import { OutfitCard } from "./OutfitCard";
import styles from "./OutfitList.module.css";

interface Props {
  outfits: Outfit[];
  gender: Gender;
  onStartOver: () => void;
}

export function OutfitList({ outfits, gender, onStartOver }: Props) {
  const [expandedRank, setExpandedRank] = useState<number | null>(null);

  return (
    <section className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.heading}>{STRINGS.results.heading}</h1>
        <p className={styles.subheading}>{STRINGS.results.subheading}</p>
      </header>
      <ol className={styles.list}>
        {outfits.map((outfit) => (
          <li key={outfit.rank}>
            <OutfitCard
              outfit={outfit}
              gender={gender}
              expanded={expandedRank === outfit.rank}
              onToggle={() => setExpandedRank((current) => (current === outfit.rank ? null : outfit.rank))}
            />
          </li>
        ))}
      </ol>
      <button type="button" className={styles.startOver} onClick={onStartOver}>
        {STRINGS.results.startOver}
      </button>
    </section>
  );
}
