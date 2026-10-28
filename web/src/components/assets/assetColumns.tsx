import Link from 'next/link';
import type { Column } from '@/components/ui/DataTable';
import { formatDate } from '@/lib/dates';
import type { AssetRow } from '@/types/odata';
import { StatusPill } from './StatusPill';
import styles from './AssetsListPage.module.css';

export type AssetColumn = Column<AssetRow> & { defaultVisible: boolean };

export const ASSET_COLUMNS: AssetColumn[] = [
  {
    id: 'assetTag',
    header: 'Asset tag',
    sortKey: 'assetTag',
    nowrap: true,
    defaultVisible: true,
    render: (r) => (
      <Link href={`/assets/${r.asset_ID}`} className={styles.tag}>
        {r.assetTag ?? '—'}
      </Link>
    ),
  },
  { id: 'model', header: 'Model', sortKey: 'model', defaultVisible: true, render: (r) => r.model ?? '—' },
  { id: 'serialNumber', header: 'Serial number', sortKey: 'serialNumber', nowrap: true, defaultVisible: true, render: (r) => r.serialNumber ?? '—' },
  { id: 'category', header: 'Category', sortKey: 'categoryName', defaultVisible: true, render: (r) => r.categoryName ?? '—' },
  { id: 'status', header: 'Status', sortKey: 'status', defaultVisible: true, render: (r) => <StatusPill status={r.status} /> },
  { id: 'holder', header: 'Holder', sortKey: 'holderName', defaultVisible: true, render: (r) => r.holderName ?? '—' },
  { id: 'location', header: 'Location', defaultVisible: false, render: (r) => r.holderLocation ?? '—' },
  { id: 'vendor', header: 'Vendor', defaultVisible: false, render: (r) => r.vendorName ?? '—' },
  { id: 'warranty', header: 'Warranty ends', sortKey: 'warrantyExpiry', nowrap: true, defaultVisible: true, render: (r) => formatDate(r.warrantyExpiry) || '—' },
];

export const SORTABLE = ASSET_COLUMNS.flatMap((c) => (c.sortKey ? [c.sortKey] : []));
