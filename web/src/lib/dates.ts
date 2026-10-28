const DAY = 24 * 60 * 60 * 1000;

/** Local calendar date as YYYY-MM-DD, the format the service uses for Date fields. */
export function isoDate(d: Date): string {
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${d.getFullYear()}-${m < 10 ? '0' + m : m}-${day < 10 ? '0' + day : day}`;
}

export function daysFromNow(days: number): string {
  return isoDate(new Date(Date.now() + days * DAY));
}

/** Whole days from today until a service date (negative once it has passed); null when there is no date. */
export function daysUntil(value: string | null): number | null {
  if (!value) return null;
  const target = new Date(`${value.slice(0, 10)}T00:00:00`).getTime();
  if (Number.isNaN(target)) return null;
  const today = new Date(`${isoDate(new Date())}T00:00:00`).getTime();
  return Math.round((target - today) / DAY);
}

/** A number with grouping and two decimals. No currency is shown: the data does not say which one it is. */
export function formatAmount(value: string | number | null): string {
  if (value === null || value === '') return '';
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
}

/** "28 Oct 2026" from a service date; empty string for a missing value. */
export function formatDate(value: string | null): string {
  if (!value) return '';
  const d = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
