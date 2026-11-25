import { Text } from './Text';
import styles from './Pagination.module.css';

type Props = {
  page: number;
  pageSize: number;
  total: number;
  /** Plural noun for the summary, e.g. "assets". */
  noun: string;
  onPage: (page: number) => void;
};

/** Up to five page numbers around the current page. */
function windowOf(page: number, last: number): number[] {
  const start = Math.max(1, Math.min(page - 2, last - 4));
  const end = Math.min(last, start + 4);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function Pagination({ page, pageSize, total, noun, onPage }: Props) {
  const last = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className={styles.bar}>
      <Text tone="muted" size="sm">
        {total === 0 ? `No ${noun}` : `Showing ${from}–${to} of ${total} ${noun}`}
      </Text>
      {last > 1 && (
        <nav aria-label="Pagination" className={styles.pages}>
          <button type="button" className={styles.page} disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Previous page">
            ‹
          </button>
          {windowOf(page, last).map((p) => (
            <button
              key={p}
              type="button"
              className={`${styles.page} ${p === page ? styles.current : ''}`}
              aria-current={p === page ? 'page' : undefined}
              onClick={() => onPage(p)}
            >
              {p}
            </button>
          ))}
          <button type="button" className={styles.page} disabled={page >= last} onClick={() => onPage(page + 1)} aria-label="Next page">
            ›
          </button>
        </nav>
      )}
    </div>
  );
}
