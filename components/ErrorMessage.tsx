import { STRINGS } from "@/lib/strings";
import styles from "./ErrorMessage.module.css";

interface Props {
  onRetry: () => void;
  onStartOver: () => void;
}

export function ErrorMessage({ onRetry, onStartOver }: Props) {
  return (
    <section className={styles.wrap} role="alert">
      <h1 className={styles.heading}>{STRINGS.error.heading}</h1>
      <p className={styles.message}>{STRINGS.error.message}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.retry} onClick={onRetry}>
          {STRINGS.error.retry}
        </button>
        <button type="button" className={styles.startOver} onClick={onStartOver}>
          {STRINGS.error.startOver}
        </button>
      </div>
    </section>
  );
}
