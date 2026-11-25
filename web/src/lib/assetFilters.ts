import { daysFromNow, isoDate } from './dates';
import { quote, searchFilter } from './query';
import { STATUSES } from './status';

export type AssetFilterValues = {
  q: string;
  tag: string;
  serial: string;
  status: string;
  category: string;
  warranty: string;
};

export const NO_FILTERS: AssetFilterValues = { q: '', tag: '', serial: '', status: '', category: '', warranty: '' };

export const hasFilters = (f: AssetFilterValues) => Object.values(f).some(Boolean);

/** Turns the filter values (which come from the URL) into $filter parts. Unknown statuses are ignored. */
export function assetFilterParts(f: AssetFilterValues): string[] {
  const parts: string[] = [];
  const q = searchFilter(['assetTag', 'serialNumber', 'model', 'holderName', 'categoryName'], f.q);
  if (q) parts.push(q);
  const tag = searchFilter(['assetTag'], f.tag);
  if (tag) parts.push(tag);
  const serial = searchFilter(['serialNumber'], f.serial);
  if (serial) parts.push(serial);
  if (STATUSES.some((s) => s.key === f.status)) parts.push(`status eq ${quote(f.status)}`);
  if (f.category) parts.push(`categoryName eq ${quote(f.category)}`);
  if (f.warranty === '30') {
    parts.push(
      `warrantyExpiry ge ${isoDate(new Date())} and warrantyExpiry le ${daysFromNow(30)}`,
      "(status eq 'In Stock' or status eq 'Assigned' or status eq 'Maintenance')",
    );
  }
  return parts;
}
