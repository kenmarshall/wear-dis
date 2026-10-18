"use client";

import { useRef, useState } from "react";
import { ErrorMessage } from "@/components/ErrorMessage";
import { EventInput, type Guidance } from "@/components/EventInput";
import { FollowUpQuestions } from "@/components/FollowUpQuestions";
import { LoadingState } from "@/components/LoadingState";
import { OutfitList } from "@/components/OutfitList";
import { fetchOutfits, fetchQuestions } from "@/lib/api";
import type { Answer, Gender, Outfit, Question } from "@/lib/schemas";
import { STRINGS } from "@/lib/strings";
import styles from "./page.module.css";

type Step = "start" | "loadingQuestions" | "questions" | "loadingOutfits" | "results" | "error";

export default function Home() {
  const [step, setStep] = useState<Step>("start");
  const [event, setEvent] = useState("");
  const [guidance, setGuidance] = useState<Guidance | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [gender, setGender] = useState<Gender>("women");
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const inFlight = useRef(false);
  // Repeats the request that failed, with the same event/answers, so "Try again" never loses input.
  const retryLast = useRef<(() => void) | null>(null);

  async function runGuarded(task: () => Promise<void>, retry: () => void): Promise<void> {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      await task();
    } catch {
      retryLast.current = retry;
      setStep("error");
    } finally {
      inFlight.current = false;
    }
  }

  function handleEvent(nextEvent: string): Promise<void> {
    return runGuarded(
      async () => {
        setEvent(nextEvent);
        setGuidance(null);
        setStep("loadingQuestions");
        const result = await fetchQuestions({ event: nextEvent });
        if (result.usable) {
          setQuestions(result.questions);
          setStep("questions");
        } else {
          setGuidance({ message: result.guidance ?? STRINGS.error.message, example: result.exampleEvent });
          setStep("start");
        }
      },
      () => void handleEvent(nextEvent),
    );
  }

  function handleAnswers(nextGender: Gender, answers: Answer[]): Promise<void> {
    return runGuarded(
      async () => {
        setGender(nextGender);
        setStep("loadingOutfits");
        const result = await fetchOutfits({ event, gender: nextGender, answers });
        setOutfits(result.outfits);
        setStep("results");
      },
      () => void handleAnswers(nextGender, answers),
    );
  }

  function handleRetry(): void {
    retryLast.current?.();
  }

  function handleStartOver(): void {
    setEvent("");
    setGuidance(null);
    setQuestions([]);
    setOutfits([]);
    retryLast.current = null;
    setStep("start");
  }

  return (
    <main className={styles.main}>
      <p className={styles.brand}>{STRINGS.brand}</p>

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
      {step === "results" && (
        <OutfitList outfits={outfits} gender={gender} onStartOver={handleStartOver} />
      )}
      {step === "error" && <ErrorMessage onRetry={handleRetry} onStartOver={handleStartOver} />}
    </main>
  );
}
