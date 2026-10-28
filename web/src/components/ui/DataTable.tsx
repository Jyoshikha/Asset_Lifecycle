import type { Sort } from '@/lib/query';
import styles from './DataTable.module.css';

export type Column<T> = {
  id: string;
  header: string;
  render: (row: T) => React.ReactNode;
  /** The field the service sorts by; columns without one are not sortable. */
  sortKey?: string;
  nowrap?: boolean;
  align?: 'left' | 'right';
};

type Props<T> = {
  caption: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  sort?: Sort;
  onSort?: (key: string) => void;
  onRowClick?: (row: T) => void;
  empty: React.ReactNode;
  compact?: boolean;
  busy?: boolean;
};

export function DataTable<T>({ caption, columns, rows, rowKey, sort, onSort, onRowClick, empty, compact, busy }: Props<T>) {
  if (rows.length === 0) return <div className={styles.empty}>{empty}</div>;

  return (
    <div className={`${styles.scroll} ${busy ? styles.busy : ''}`} aria-busy={busy || undefined}>
      <table className={`${styles.table} ${compact ? styles.compact : ''}`}>
        <caption className={styles.caption}>{caption}</caption>
        <thead>
          <tr>
            {columns.map((c) => {
              const active = sort && c.sortKey === sort.key;
              return (
                <th
                  key={c.id}
                  scope="col"
                  className={c.align === 'right' ? styles.right : undefined}
                  aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                >
                  {c.sortKey && onSort ? (
                    <button type="button" className={styles.sortButton} onClick={() => onSort(c.sortKey as string)}>
                      {c.header}
                      <span className={styles.arrow} aria-hidden="true">
                        {active ? (sort.dir === 'asc' ? '▲' : '▼') : '↕'}
                      </span>
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className={onRowClick ? styles.clickable : undefined} onClick={onRowClick ? () => onRowClick(row) : undefined}>
              {columns.map((c) => (
                <td key={c.id} className={[c.nowrap ? styles.nowrap : '', c.align === 'right' ? styles.right : ''].join(' ')}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
