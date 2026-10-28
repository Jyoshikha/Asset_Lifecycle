import { Badge } from '@/components/ui/Badge';
import { Panel } from '@/components/ui/Panel';
import { RemoteView } from '@/components/ui/RemoteView';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import type { Remote } from '@/hooks/useOData';
import { formatDate } from '@/lib/dates';
import type { HistoryRow } from '@/types/odata';
import styles from './RecentActivityTable.module.css';

type Props = { remote: Remote<HistoryRow[]>; retry: () => void };

// The ledger stores the verb; the table shows what happened to the asset.
const ACTION_LABEL: Record<string, string> = { Assign: 'Assigned', Return: 'Returned', Retire: 'Retired' };

export function RecentActivityTable({ remote, retry }: Props) {
  return (
    <Panel title="Recent asset activity" subtitle="Latest ownership changes across all assets">
      <RemoteView remote={remote} retry={retry} placeholder={<Skeleton height={160} />}>
        {(rows) =>
          rows.length === 0 ? (
            <Text tone="muted">No ownership changes have been recorded yet.</Text>
          ) : (
            <div className={styles.scroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Asset</th>
                    <th scope="col">Action</th>
                    <th scope="col">Employee</th>
                    <th scope="col">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.ledger_ID}>
                      <td className={styles.tag}>{r.assetTag ?? '—'}</td>
                      <td>
                        <Badge>{(r.action && ACTION_LABEL[r.action]) ?? r.action ?? '—'}</Badge>
                      </td>
                      <td>{r.toName ?? r.fromName ?? '—'}</td>
                      <td className={styles.date}>{formatDate(r.transitionDate) || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </RemoteView>
    </Panel>
  );
}
