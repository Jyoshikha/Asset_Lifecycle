import { Panel } from '@/components/ui/Panel';
import { RemoteView } from '@/components/ui/RemoteView';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import Link from 'next/link';
import type { Remote } from '@/hooks/useOData';
import { assetsUrl } from '@/lib/nav';
import { STATUSES, percent, totalOf } from '@/lib/status';
import styles from './AssetStatusChart.module.css';

type Props = { remote: Remote<Record<string, number>>; retry: () => void };

// r = 100 / (2 * PI) makes the circle's circumference exactly 100, so dash lengths are percentages.
const R = 15.9155;

function Donut({ counts }: { counts: Record<string, number> }) {
  const total = totalOf(counts);
  let used = 0;
  const arcs = STATUSES.filter((s) => (counts[s.key] ?? 0) > 0).map((s) => {
    const share = ((counts[s.key] ?? 0) * 100) / total;
    const arc = { key: s.key, color: s.color, share, offset: 25 - used };
    used += share;
    return arc;
  });

  return (
    <div className={styles.donut}>
      <svg viewBox="0 0 42 42" role="img" aria-label={`${total} assets by lifecycle status`}>
        <circle cx="21" cy="21" r={R} fill="none" stroke="var(--color-hover)" strokeWidth="5" />
        {arcs.map((a) => (
          <circle
            key={a.key}
            cx="21"
            cy="21"
            r={R}
            fill="none"
            stroke={a.color}
            strokeWidth="5"
            strokeDasharray={`${a.share} ${100 - a.share}`}
            strokeDashoffset={a.offset}
          />
        ))}
      </svg>
      <div className={styles.center}>
        <span className={styles.total}>{total}</span>
        <Text tone="muted" size="sm">Total assets</Text>
      </div>
    </div>
  );
}

export function AssetStatusChart({ remote, retry }: Props) {
  return (
    <Panel title="Asset status" subtitle="Current asset count by lifecycle status">
      <RemoteView remote={remote} retry={retry} placeholder={<Skeleton height={180} />}>
        {(counts) => {
          const total = totalOf(counts);
          if (total === 0) return <Text tone="muted">No assets are registered yet.</Text>;
          return (
            <div className={styles.layout}>
              <Donut counts={counts} />
              <ul className={styles.legend}>
                {STATUSES.map((s) => {
                  const n = counts[s.key] ?? 0;
                  return (
                    <li key={s.key}>
                      <Link href={assetsUrl({ status: s.key })} className={styles.row}>
                        <span className={styles.dot} style={{ background: s.color }} aria-hidden="true" />
                        <span className={styles.name}>{s.label}</span>
                        <span className={styles.count}>{n}</span>
                        <span className={styles.pct}>{percent(n, total)}%</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        }}
      </RemoteView>
    </Panel>
  );
}
