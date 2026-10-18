"use client";

import { useRef, useState } from "react";
import { EventInput, type Guidance } from "@/components/EventInput";
import { FollowUpQuestions } from "@/components/FollowUpQuestions";
import { LoadingState } from "@/components/LoadingState";
import { OutfitList } from "@/components/OutfitList";
import { fetchOutfits, fetchQuestions } from "@/lib/api";
import type { Answer, Gender, Outfit, Question } from "@/lib/schemas";
import { STRINGS } from "@/lib/strings";
import styles from "./page.module.css";

type Step = "start" | "loadingQuestions" | "questions" | "loadingOutfits" | "results";

export default function Home() {
  const [step, setStep] = useState<Step>("start");
  const [event, setEvent] = useState("");
  const [guidance, setGuidance] = useState<Guidance | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  async function runGuarded(task: () => Promise<void>): Promise<void> {
    if (inFlight.current) return;
    inFlight.current = true;
    setError(null);
    try {
      await task();
    } finally {
      inFlight.current = false;
    }
  }

  function handleEvent(nextEvent: string): Promise<void> {
    return runGuarded(async () => {
      setEvent(nextEvent);
      setGuidance(null);
      setStep("loadingQuestions");
      try {
        const result = await fetchQuestions({ event: nextEvent });
        if (result.usable) {
          setQuestions(result.questions);
          setStep("questions");
        } else {
          setGuidance({ message: result.guidance ?? STRINGS.error.generic, example: result.exampleEvent });
          setStep("start");
        }
      } catch {
        setError(STRINGS.error.generic);
        setStep("start");
      }
    });
  }

  function handleAnswers(gender: Gender, answers: Answer[]): Promise<void> {
    return runGuarded(async () => {
      setStep("loadingOutfits");
      try {
        const result = await fetchOutfits({ event, gender, answers });
        setOutfits(result.outfits);
        setStep("results");
      } catch {
        setError(STRINGS.error.generic);
        setStep("questions");
      }
    });
  }

  return (
    <main className={styles.main}>
      <p className={styles.brand}>{STRINGS.brand}</p>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {step === "start" && (
        <EventInput initialValue={event} guidance={guidance} onSubmit={handleEvent} />
      )}
      {step === "loadingQuestions" && (
        <LoadingState message={STRINGS.loading.questionsMessage} detail={STRINGS.loading.questionsDetail} />
      )}
      {step === "questions" && (
        <FollowUpQuestions questions={questions} onSubmit={handleAnswers} onBack={() => setStep("start")} />
      )}
      {step === "loadingOutfits" && (
        <LoadingState message={STRINGS.loading.outfitsMessage} detail={STRINGS.loading.outfitsDetail} />
      )}
      {step === "results" && <OutfitList outfits={outfits} />}
    </main>
  );
}
