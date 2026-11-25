'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { Facts } from '@/components/ui/Facts';
import { Icon } from '@/components/ui/Icon';
import { Notice } from '@/components/ui/Notice';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { useRemote } from '@/hooks/useOData';
import { daysUntil, formatAmount, formatDate } from '@/lib/dates';
import { odataEntity } from '@/lib/odata';
import type { AssetDetail } from '@/types/odata';
import { AssetActions } from './AssetActions';
import { StatusPill } from './StatusPill';
import styles from './AssetDetailPage.module.css';
import { useState } from 'react';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const EXPAND = [
  'category($select=name)',
  'vendor($select=name)',
  'currentHolder($select=fullName,email,location)',
  'ownershipHistory($orderby=transitionDate desc,createdAt desc;$expand=fromEmployee($select=fullName),toEmployee($select=fullName))',
  'maintenanceRecords($orderby=reportedDate desc;$expand=serviceVendor($select=name))',
  'archiveRecords',
].join(',');

const TABS = [
  { id: 'general', label: 'Overview' },
  { id: 'purchase', label: 'Purchase & warranty' },
  { id: 'ownership', label: 'Ownership' },
  { id: 'history', label: 'Ownership history' },
  { id: 'maintenance', label: 'Maintenance records' },
  { id: 'archive', label: 'Archive record' },
];

const ACTION_LABEL: Record<string, string> = { Assign: 'Assigned', Return: 'Returned', Retire: 'Retired' };

function Warranty({ date }: { date: string | null }) {
  const days = daysUntil(date);
  if (days === null) return <>—</>;
  return (
    <span className={styles.inline}>
      {formatDate(date)}
      {days < 0 ? <Badge tone="danger">Expired</Badge> : days <= 30 ? <Badge tone="warn">{days === 0 ? 'Ends today' : `Ends in ${days} days`}</Badge> : null}
    </span>
  );
}

export function AssetDetailPage({ id }: { id: string }) {
  const [message, setMessage] = useState('');
  const { result, retry } = useRemote<AssetDetail>(
    (signal) =>
      UUID.test(id)
        ? odataEntity<AssetDetail>(`AssetSrv(asset_ID=${id},IsActiveEntity=true)?$expand=${encodeURIComponent(EXPAND)}`, signal)
        : Promise.reject(new Error('This asset address is not valid.')),
    id,
  );

  if (result.state === 'loading') {
    return (
      <div className="page" role="status" aria-label="Loading asset">
        <Skeleton height={56} />
        <Skeleton height={220} />
        <Skeleton height={160} />
      </div>
    );
  }

  if (result.state === 'error') {
    return (
      <div className="page">
        <PageHeader crumbs={[{ label: 'Hardware assets', href: '/assets' }, { label: 'Not available' }]} title="Asset not available" />
        <Notice tone="error">{result.message}</Notice>
        <div>
          <Link href="/assets">Back to hardware assets</Link> · <button type="button" className={styles.link} onClick={retry}>Try again</button>
        </div>
      </div>
    );
  }

  const a = result.data;
  const reload = (text: string) => {
    setMessage(text);
    retry();
  };
  const holder = a.currentHolder;

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Hardware assets', href: '/assets' }, { label: a.assetTag ?? 'Asset' }]}
        leading={
          <span className={styles.tile}>
            <Icon name="laptop" size={28} />
          </span>
        }
        title={a.assetTag ?? 'Asset'}
        badge={<StatusPill status={a.status} />}
        subtitle={a.model}
        actions={<AssetActions asset={a} onDone={reload} />}
      />

      {message && (
        <Notice tone="success" onDismiss={() => setMessage('')}>
          {message}
        </Notice>
      )}

      <nav aria-label="Sections" className={styles.tabs}>
        {TABS.map((t) => (
          <a key={t.id} href={`#${t.id}`} className={styles.tab}>
            {t.label}
          </a>
        ))}
      </nav>

      <Section id="general" title="General information" icon="info">
        <Facts
          items={[
            { label: 'Asset tag', value: a.assetTag },
            { label: 'Model', value: a.model },
            { label: 'Status', value: <StatusPill status={a.status} /> },
            { label: 'Serial number', value: a.serialNumber },
            { label: 'Category', value: a.category?.name },
          ]}
        />
      </Section>

      <Section id="purchase" title="Purchase & warranty" icon="document">
        <Facts
          items={[
            { label: 'Vendor', value: a.vendor?.name },
            { label: 'Purchase date', value: formatDate(a.purchaseDate) },
            { label: 'Purchase cost', value: formatAmount(a.purchaseCost) },
            { label: 'Warranty expiry', value: <Warranty date={a.warrantyExpiry} /> },
          ]}
        />
      </Section>

      <Section id="ownership" title="Ownership" icon="user">
        <Facts
          items={[
            { label: 'Current holder', value: holder?.fullName },
            { label: 'Holder email', value: holder?.email },
            { label: 'Location', value: holder?.location },
            { label: 'First distribution date', value: formatDate(a.firstDistributionDate) },
          ]}
        />
      </Section>

      <Section id="history" title="Ownership history" icon="history">
        <DataTable
          caption="Ownership history"
          rows={a.ownershipHistory}
          rowKey={(r) => r.ledger_ID}
          columns={[
            { id: 'date', header: 'Date', nowrap: true, render: (r) => formatDate(r.transitionDate) || '—' },
            { id: 'action', header: 'Action', render: (r) => <Badge>{(r.action && ACTION_LABEL[r.action]) ?? r.action ?? '—'}</Badge> },
            { id: 'from', header: 'From', render: (r) => r.fromEmployee?.fullName ?? '—' },
            { id: 'to', header: 'To', render: (r) => r.toEmployee?.fullName ?? '—' },
            { id: 'notes', header: 'Notes', render: (r) => r.notes ?? '—' },
          ]}
          empty={
            <>
              <Text>No ownership history yet</Text>
              <br />
              <Text tone="muted" size="sm">Ownership changes appear here when the asset is assigned or returned.</Text>
            </>
          }
        />
      </Section>

      <Section id="maintenance" title="Maintenance records" icon="wrench">
        <DataTable
          caption="Maintenance records"
          rows={a.maintenanceRecords}
          rowKey={(r) => r.maintenance_ID}
          columns={[
            { id: 'reported', header: 'Reported', nowrap: true, render: (r) => formatDate(r.reportedDate) || '—' },
            { id: 'type', header: 'Type', render: (r) => r.type ?? '—' },
            { id: 'vendor', header: 'Vendor', render: (r) => r.serviceVendor?.name ?? '—' },
            { id: 'status', header: 'Status', render: (r) => <Badge tone={r.status === 'Completed' ? 'good' : 'warn'}>{r.status ?? '—'}</Badge> },
            { id: 'outcome', header: 'Outcome', render: (r) => r.outcome ?? '—' },
            { id: 'cost', header: 'Cost', align: 'right', render: (r) => formatAmount(r.cost) || '—' },
            { id: 'completed', header: 'Completed', nowrap: true, render: (r) => formatDate(r.completedDate) || '—' },
          ]}
          empty={<Text tone="muted">No maintenance has been recorded for this asset.</Text>}
        />
      </Section>

      <Section id="archive" title="Archive record" icon="inventory">
        {a.archiveRecords.length === 0 ? (
          <Text tone="muted">This asset has not been archived.</Text>
        ) : (
          a.archiveRecords.map((r) => (
            <Facts
              key={r.archive_ID}
              items={[
                { label: 'Archived on', value: formatDate(r.archivedAt) },
                { label: 'Reason', value: r.reason },
                { label: 'Disposal method', value: r.disposalMethod },
                { label: 'Certificate no.', value: r.disposalCertNo },
              ]}
            />
          ))
        )}
      </Section>
    </div>
  );
}
