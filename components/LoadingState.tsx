import styles from "./LoadingState.module.css";

interface Props {
  message: string;
  detail: string;
}

export function LoadingState({ message, detail }: Props) {
  return (
    <section className={styles.wrap} role="status" aria-live="polite">
      <div className={styles.dots} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className={styles.message}>{message}</p>
      <p className={styles.detail}>{detail}</p>
    </section>
  );
}
