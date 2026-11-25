/** Lifecycle statuses in display order. `color` is a design token; a text label always accompanies it. */
export const STATUSES = [
  { key: 'Assigned', label: 'Assigned', color: 'var(--chart-assigned)' },
  { key: 'In Stock', label: 'In stock', color: 'var(--chart-in-stock)' },
  { key: 'Maintenance', label: 'In maintenance', color: 'var(--chart-maintenance)' },
  { key: 'Retired', label: 'Retired', color: 'var(--chart-retired)' },
  { key: 'Archived', label: 'Archived', color: 'var(--chart-archived)' },
] as const;

export type StatusKey = (typeof STATUSES)[number]['key'];

/** Percentage rounded to a whole number; 0 when there is nothing to divide by. */
export function percent(part: number, total: number): number {
  return total > 0 ? Math.round((part * 100) / total) : 0;
}

export function totalOf(counts: Record<string, number>): number {
  return Object.values(counts).reduce((sum, n) => sum + n, 0);
}
