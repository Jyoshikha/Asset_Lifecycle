import { mapRemote, type Remote } from '@/hooks/useOData';
import { assetsUrl } from '@/lib/nav';
import { percent, totalOf } from '@/lib/status';
import { MetricCard } from './MetricCard';
import styles from './KPIGrid.module.css';

type Props = {
  statusCounts: Remote<Record<string, number>>;
  warrantyExpiring: Remote<number>;
};

export function KPIGrid({ statusCounts, warrantyExpiring }: Props) {
  const total = mapRemote(statusCounts, totalOf);
  const count = (key: string) => mapRemote(statusCounts, (c) => c[key] ?? 0);
  const share = (key: string) =>
    statusCounts.state === 'ready' ? `${percent(statusCounts.data[key] ?? 0, totalOf(statusCounts.data))}% of all assets` : undefined;

  return (
    <div className={styles.grid}>
      <MetricCard label="Total assets" icon="box" value={total} hint="All registered assets" href={assetsUrl()} />
      <MetricCard label="In stock" icon="inventory" value={count('In Stock')} hint={share('In Stock')} href={assetsUrl({ status: 'In Stock' })} />
      <MetricCard label="Assigned" icon="user" value={count('Assigned')} hint={share('Assigned')} href={assetsUrl({ status: 'Assigned' })} />
      <MetricCard label="In maintenance" icon="wrench" value={count('Maintenance')} hint="Currently with service" href={assetsUrl({ status: 'Maintenance' })} />
      <MetricCard label="Warranty expiring" icon="shield" value={warrantyExpiring} hint="Ends within 30 days" href={assetsUrl({ warranty: true })} />
    </div>
  );
}
