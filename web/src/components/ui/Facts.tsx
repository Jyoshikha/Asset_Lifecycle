import styles from './Facts.module.css';

export type Fact = { label: string; value: React.ReactNode };

/** Label / value pairs in a responsive grid. A missing value shows a dash, never a blank. */
export function Facts({ items }: { items: Fact[] }) {
  return (
    <dl className={styles.grid}>
      {items.map((f) => (
        <div key={f.label} className={styles.item}>
          <dt>{f.label}</dt>
          <dd>{f.value === null || f.value === undefined || f.value === '' ? '—' : f.value}</dd>
        </div>
      ))}
    </dl>
  );
}
