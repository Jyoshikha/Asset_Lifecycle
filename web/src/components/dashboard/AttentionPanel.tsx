import { Panel } from '@/components/ui/Panel';
import { mapRemote, type Remote } from '@/hooks/useOData';
import { assetsUrl, maintenanceUrl } from '@/lib/nav';
import { AttentionItem } from './AttentionItem';
import styles from './AttentionPanel.module.css';

type Props = {
  warrantyExpiring: Remote<number>;
  overdueMaintenance: Remote<number>;
  statusCounts: Remote<Record<string, number>>;
};

/** Items an administrator can act on. Each one opens the records behind its number. */
export function AttentionPanel({ warrantyExpiring, overdueMaintenance, statusCounts }: Props) {
  return (
    <Panel id="attention" title="Needs attention" subtitle="Items that may need an administrator">
      <ul className={styles.list}>
        <AttentionItem
          icon="shield"
          title="Warranty expires soon"
          description="Assets in use with a warranty ending in the next 30 days"
          count={warrantyExpiring}
          href={assetsUrl()}
          actionLabel="View assets"
          urgent
        />
        <AttentionItem
          icon="wrench"
          title="Maintenance overdue"
          description="Maintenance still open more than 7 days after it was reported"
          count={overdueMaintenance}
          href={maintenanceUrl}
          actionLabel="Review"
          urgent
        />
        <AttentionItem
          icon="inventory"
          title="Awaiting assignment"
          description="Assets in stock and ready to be assigned"
          count={mapRemote(statusCounts, (c) => c['In Stock'] ?? 0)}
          href={assetsUrl('In Stock')}
          actionLabel="View inventory"
        />
      </ul>
    </Panel>
  );
}
