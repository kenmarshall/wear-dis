"use client";

import { useState, type FormEvent } from "react";
import { EVENT_CATEGORIES } from "@/lib/categories";
import { EVENT_MAX_LENGTH } from "@/lib/schemas";
import { STRINGS } from "@/lib/strings";
import styles from "./EventInput.module.css";

export interface Guidance {
  message: string;
  example: string | null;
}

interface Props {
  initialValue: string;
  guidance: Guidance | null;
  onSubmit: (event: string) => void;
}

export function EventInput({ initialValue, guidance, onSubmit }: Props) {
  const [value, setValue] = useState(initialValue);
  const trimmed = value.trim();

  function handleSubmit(formEvent: FormEvent<HTMLFormElement>): void {
    formEvent.preventDefault();
    if (trimmed.length > 0) onSubmit(trimmed);
  }

  return (
    <section className={styles.wrap}>
      <h1 className={styles.heading}>{STRINGS.start.heading}</h1>
      <p className={styles.subheading}>{STRINGS.start.subheading}</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="event-input" className={styles.label}>
          {STRINGS.start.inputLabel}
        </label>
        <textarea
          id="event-input"
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={STRINGS.start.inputPlaceholder}
          maxLength={EVENT_MAX_LENGTH}
          rows={3}
          aria-describedby={guidance ? "event-guidance" : undefined}
        />

        {guidance && (
          <div id="event-guidance" className={styles.guidance} role="alert">
            <p>{guidance.message}</p>
            {guidance.example && (
              <p className={styles.example}>
                {STRINGS.start.exampleLabel}{" "}
                <button
                  type="button"
                  className={styles.exampleButton}
                  onClick={() => setValue(guidance.example ?? "")}
                  aria-label={`${STRINGS.start.useExample}: ${guidance.example}`}
                >
                  “{guidance.example}”
                </button>
              </p>
            )}
          </div>
        )}

        <button type="submit" className={styles.submit} disabled={trimmed.length === 0}>
          {STRINGS.start.submit}
        </button>
      </form>

      <div className={styles.categories}>
        <p className={styles.label}>{STRINGS.start.categoriesLabel}</p>
        <ul className={styles.chips}>
          {EVENT_CATEGORIES.map((category) => (
            <li key={category}>
              <button type="button" className={styles.chip} onClick={() => onSubmit(category)}>
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
