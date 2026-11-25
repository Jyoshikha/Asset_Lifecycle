import { STATUSES } from '@/lib/status';
import styles from './StatusPill.module.css';

/** The lifecycle status as a dot and its name. The colour only reinforces the word. */
export function StatusPill({ status }: { status: string | null }) {
  if (!status) return <span>—</span>;
  const known = STATUSES.find((s) => s.key === status);
  return (
    <span className={styles.pill} style={{ ['--tone' as string]: known?.color ?? 'var(--chart-retired)' }}>
      <span className={styles.dot} aria-hidden="true" />
      {known?.label ?? status}
    </span>
  );
}
