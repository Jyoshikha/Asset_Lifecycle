import styles from './Notice.module.css';

type Props = { tone: 'success' | 'error' | 'info'; children: React.ReactNode; onDismiss?: () => void };

/** A short message above the content. Errors interrupt screen readers; the rest are announced politely. */
export function Notice({ tone, children, onDismiss }: Props) {
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`${styles.notice} ${styles[tone]}`}>
      <span>{children}</span>
      {onDismiss && (
        <button type="button" className={styles.dismiss} onClick={onDismiss} aria-label="Dismiss message">
          ×
        </button>
      )}
    </div>
  );
}
