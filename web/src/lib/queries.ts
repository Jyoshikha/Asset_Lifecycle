import { odataCount, odataGet } from './odata';
import { daysFromNow, isoDate } from './dates';
import type { CategoryCount, HistoryRow, StatusCount } from '@/types/odata';

// Every figure is computed by the service ($apply / $count), so no client-side row limit can distort it.

const OPEN_MAINTENANCE = "(status eq 'Open' or status eq 'In Progress')";
const ACTIVE_ASSET = "(status eq 'In Stock' or status eq 'Assigned' or status eq 'Maintenance')";

/** Assets per lifecycle status, keyed by the status value the service stores. */
export async function fetchStatusCounts(signal: AbortSignal): Promise<Record<string, number>> {
  const q = 'AssetOverviewSrv?$apply=' + encodeURIComponent('groupby((status),aggregate($count as n))');
  const { value } = await odataGet<StatusCount>(q, signal);
  return Object.fromEntries(value.map((r) => [r.status, r.n]));
}

export type CategoryBar = { label: string; count: number };

/** Assets per category, largest first. */
export async function fetchCategoryCounts(signal: AbortSignal): Promise<CategoryBar[]> {
  const q = 'AssetOverviewSrv?$apply=' + encodeURIComponent('groupby((categoryName),aggregate($count as n))');
  const { value } = await odataGet<CategoryCount>(q, signal);
  return value
    .map((r) => ({ label: r.categoryName ?? 'No category', count: r.n }))
    .sort((a, b) => b.count - a.count);
}

/** Assets still in use whose warranty ends within the next 30 days. */
export function fetchWarrantyExpiring(signal: AbortSignal): Promise<number> {
  const filter = `warrantyExpiry ge ${isoDate(new Date())} and warrantyExpiry le ${daysFromNow(30)} and ${ACTIVE_ASSET}`;
  return odataCount('AssetOverviewSrv', filter, signal);
}

/** Maintenance still open that was reported more than 7 days ago. */
export function fetchOverdueMaintenance(signal: AbortSignal): Promise<number> {
  const filter = `${OPEN_MAINTENANCE} and reportedDate lt ${daysFromNow(-7)}`;
  return odataCount('MaintenanceOverviewSrv', filter, signal);
}

/** The latest ownership ledger entries across all assets. */
export async function fetchRecentActivity(signal: AbortSignal, limit = 6): Promise<HistoryRow[]> {
  const q =
    'AssetHistorySrv?$select=ledger_ID,assetTag,action,transitionDate,fromName,toName' +
    `&$orderby=${encodeURIComponent('transitionDate desc,createdAt desc')}&$top=${limit}`;
  const { value } = await odataGet<HistoryRow>(q, signal);
  return value;
}
