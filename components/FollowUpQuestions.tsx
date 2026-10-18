"use client";

import { useState } from "react";
import { GENDERS, type Answer, type Gender, type Question } from "@/lib/schemas";
import { STRINGS } from "@/lib/strings";
import styles from "./FollowUpQuestions.module.css";

interface Props {
  questions: Question[];
  onSubmit: (gender: Gender, answers: Answer[]) => void;
  onBack: () => void;
}

interface OptionRowProps<T extends string> {
  id: string;
  text: string;
  options: readonly { value: T; label: string }[];
  selected: T | undefined;
  onSelect: (value: T) => void;
}

function OptionRow<T extends string>({ id, text, options, selected, onSelect }: OptionRowProps<T>) {
  return (
    <fieldset className={styles.question}>
      <legend className={styles.questionText} id={`${id}-label`}>
        {text}
      </legend>
      <div className={styles.options} role="radiogroup" aria-labelledby={`${id}-label`}>
        {options.map((option) => {
          const isSelected = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={isSelected ? `${styles.option} ${styles.selected}` : styles.option}
              onClick={() => onSelect(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

const GENDER_OPTIONS = GENDERS.map((gender) => ({
  value: gender,
  label: STRINGS.followUps.genderOptions[gender],
}));

export function FollowUpQuestions({ questions, onSubmit, onBack }: Props) {
  const [gender, setGender] = useState<Gender | undefined>(undefined);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const allAnswered = gender !== undefined && questions.every((q) => answers[q.id] !== undefined);

  function handleSubmit(): void {
    if (!allAnswered || gender === undefined) return;
    onSubmit(
      gender,
      questions.map((q) => ({ question: q.text, answer: answers[q.id] })),
    );
  }

  return (
    <section className={styles.wrap}>
      <h1 className={styles.heading}>{STRINGS.followUps.heading}</h1>
      <p className={styles.subheading}>{STRINGS.followUps.subheading}</p>

      <div className={styles.list}>
        <OptionRow
          id="gender"
          text={STRINGS.followUps.genderQuestion}
          options={GENDER_OPTIONS}
          selected={gender}
          onSelect={setGender}
        />
        {questions.map((question) => (
          <OptionRow
            key={question.id}
            id={question.id}
            text={question.text}
            options={question.options.map((option) => ({ value: option, label: option }))}
            selected={answers[question.id]}
            onSelect={(value) => setAnswers((prev) => ({ ...prev, [question.id]: value }))}
          />
        ))}
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.submit} disabled={!allAnswered} onClick={handleSubmit}>
          {STRINGS.followUps.submit}
        </button>
        <button type="button" className={styles.back} onClick={onBack}>
          {STRINGS.followUps.back}
        </button>
      </div>
    </section>
  );
}
