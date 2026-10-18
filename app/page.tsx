"use client";

import { useRef, useState } from "react";
import { EventInput } from "@/components/EventInput";
import { LoadingState } from "@/components/LoadingState";
import { OutfitList } from "@/components/OutfitList";
import { fetchOutfits } from "@/lib/api";
import type { Outfit } from "@/lib/schemas";
import { STRINGS } from "@/lib/strings";
import styles from "./page.module.css";

type Step = "start" | "loading" | "results";

export default function Home() {
  const [step, setStep] = useState<Step>("start");
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  async function handleEvent(event: string): Promise<void> {
    if (inFlight.current) return;
    inFlight.current = true;
    setError(null);
    setStep("loading");
    try {
      const result = await fetchOutfits({ event });
      setOutfits(result.outfits);
      setStep("results");
    } catch {
      setError(STRINGS.error.generic);
      setStep("start");
    } finally {
      inFlight.current = false;
    }
  }

  return (
    <main className={styles.main}>
      <p className={styles.brand}>{STRINGS.brand}</p>
      {step === "start" && (
        <>
          <EventInput onSubmit={handleEvent} disabled={false} />
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
        </>
      )}
      {step === "loading" && <LoadingState />}
      {step === "results" && <OutfitList outfits={outfits} />}
    </main>
  );
}
