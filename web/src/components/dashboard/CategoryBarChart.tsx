import { Panel } from '@/components/ui/Panel';
import { RemoteView } from '@/components/ui/RemoteView';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import type { Remote } from '@/hooks/useOData';
import type { CategoryBar } from '@/lib/queries';
import styles from './CategoryBarChart.module.css';

const MAX_BARS = 8;

type Props = { remote: Remote<CategoryBar[]>; retry: () => void };

export function CategoryBarChart({ remote, retry }: Props) {
  return (
    <Panel title="Assets by category" subtitle="Registered assets per category">
      <RemoteView remote={remote} retry={retry} placeholder={<Skeleton height={140} />}>
        {(rows) => {
          if (rows.length === 0) return <Text tone="muted">No assets are registered yet.</Text>;
          const shown = rows.slice(0, MAX_BARS);
          const hidden = rows.length - shown.length;
          const max = Math.max(...shown.map((r) => r.count));
          return (
            <>
              <ul className={styles.list}>
                {shown.map((r) => (
                  <li key={r.label} className={styles.row}>
                    <span className={styles.label}>{r.label}</span>
                    <span className={styles.track} aria-hidden="true">
                      <span className={styles.bar} style={{ width: `${(r.count * 100) / max}%` }} />
                    </span>
                    <span className={styles.count}>{r.count}</span>
                  </li>
                ))}
              </ul>
              {hidden > 0 && (
                <Text tone="muted" size="sm">
                  Showing the {MAX_BARS} largest of {rows.length} categories.
                </Text>
              )}
            </>
          );
        }}
      </RemoteView>
    </Panel>
  );
}
