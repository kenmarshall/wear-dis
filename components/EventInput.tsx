"use client";

import { useState, type FormEvent } from "react";
import { EVENT_MAX_LENGTH } from "@/lib/schemas";
import { STRINGS } from "@/lib/strings";
import styles from "./EventInput.module.css";

interface Props {
  onSubmit: (event: string) => void;
  disabled: boolean;
}

export function EventInput({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState("");
  const trimmed = value.trim();
  const canSubmit = trimmed.length > 0 && !disabled;

  function handleSubmit(formEvent: FormEvent<HTMLFormElement>): void {
    formEvent.preventDefault();
    if (canSubmit) onSubmit(trimmed);
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
          disabled={disabled}
        />
        <button type="submit" className={styles.submit} disabled={!canSubmit}>
          {STRINGS.start.submit}
        </button>
      </form>
    </section>
  );
}
