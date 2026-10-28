'use client';

import {
  useCategoryCounts,
  useOverdueMaintenance,
  useRecentActivity,
  useStatusCounts,
  useWarrantyExpiring,
} from '@/hooks/useDashboardData';
import { AssetModelViewer3D } from './AssetModelViewer3D';
import { AssetStatusChart } from './AssetStatusChart';
import { AttentionPanel } from './AttentionPanel';
import { CategoryBarChart } from './CategoryBarChart';
import { DashboardToolbar } from './DashboardToolbar';
import { KPIGrid } from './KPIGrid';
import { RecentActivityTable } from './RecentActivityTable';
import styles from './DashboardContent.module.css';

/** Placement only: data comes from hooks, drawing from the cards. */
export function DashboardContent() {
  const status = useStatusCounts();
  const categories = useCategoryCounts();
  const warranty = useWarrantyExpiring();
  const overdue = useOverdueMaintenance();
  const activity = useRecentActivity();

  return (
    <div className={styles.page}>
      <DashboardToolbar />
      <KPIGrid statusCounts={status.result} warrantyExpiring={warranty.result} />

      <div className={styles.analytics}>
        <AssetStatusChart remote={status.result} retry={status.retry} />
        <CategoryBarChart remote={categories.result} retry={categories.retry} />
        <AssetModelViewer3D />
      </div>

      <div className={styles.operations}>
        <RecentActivityTable remote={activity.result} retry={activity.retry} />
        <AttentionPanel
          warrantyExpiring={warranty.result}
          overdueMaintenance={overdue.result}
          statusCounts={status.result}
        />
      </div>
    </div>
  );
}
