import { STRINGS } from "@/lib/strings";
import styles from "./LoadingState.module.css";

export function LoadingState() {
  return (
    <section className={styles.wrap} role="status" aria-live="polite">
      <div className={styles.dots} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className={styles.message}>{STRINGS.loading.message}</p>
      <p className={styles.detail}>{STRINGS.loading.detail}</p>
    </section>
  );
}
