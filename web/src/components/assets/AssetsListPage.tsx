'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Field, SelectInput, TextInput } from '@/components/ui/Field';
import { FilterCard } from '@/components/ui/FilterCard';
import { FormDialog } from '@/components/ui/FormDialog';
import { Notice } from '@/components/ui/Notice';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { RemoteView } from '@/components/ui/RemoteView';
import { Skeleton } from '@/components/ui/Skeleton';
import { TableCard } from '@/components/ui/TableCard';
import { ColumnsMenu, DensityMenu, pickColumns, type Density } from '@/components/ui/TableControls';
import { Text } from '@/components/ui/Text';
import { useList } from '@/hooks/useList';
import { CATEGORY_OPTIONS, VENDOR_OPTIONS, useOptions } from '@/hooks/useOptions';
import { useQueryState } from '@/hooks/useQueryState';
import { useCategoryCounts } from '@/hooks/useDashboardData';
import { assetFilterParts, hasFilters, NO_FILTERS, type AssetFilterValues } from '@/lib/assetFilters';
import { toCsv, downloadCsv } from '@/lib/csv';
import { formatDate } from '@/lib/dates';
import { odataGet, odataSend } from '@/lib/odata';
import { listPath, newId, orderBy, parseSort, sortParam } from '@/lib/query';
import { STATUSES } from '@/lib/status';
import type { AssetRow } from '@/types/odata';
import { assetFields, assetPayload } from './assetForm';
import { ASSET_COLUMNS, SORTABLE } from './assetColumns';

const PAGE_SIZE = 25;
const EXPORT_LIMIT = 5000;
const DEFAULTS = { q: '', tag: '', serial: '', status: '', category: '', warranty: '', page: '1', sort: 'assetTag', new: '' };
const SELECT = [
  'asset_ID', 'assetTag', 'serialNumber', 'model', 'status', 'categoryName', 'vendorName',
  'holderName', 'holderLocation', 'warrantyExpiry', 'purchaseDate',
];

export function AssetsListPage() {
  const router = useRouter();
  const url = useQueryState(DEFAULTS);

  const committed: AssetFilterValues = {
    q: url.get('q'),
    tag: url.get('tag'),
    serial: url.get('serial'),
    status: url.get('status'),
    category: url.get('category'),
    warranty: url.get('warranty'),
  };
  const sort = parseSort(url.get('sort'), SORTABLE, 'assetTag');
  const page = Math.max(1, parseInt(url.get('page'), 10) || 1);

  // The form edits a draft; the URL (and so the list) only changes on Apply.
  const [draft, setDraft] = useState<AssetFilterValues>(committed);
  const committedKey = JSON.stringify(committed);
  useEffect(() => setDraft(JSON.parse(committedKey) as AssetFilterValues), [committedKey]);

  const [visible, setVisible] = useState(ASSET_COLUMNS.filter((c) => c.defaultVisible).map((c) => c.id));
  const [density, setDensity] = useState<Density>('comfortable');
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);
  const [exporting, setExporting] = useState(false);

  const query = {
    entity: 'AssetOverviewSrv',
    select: SELECT,
    filters: assetFilterParts(committed),
    orderBy: orderBy(sort, 'assetTag'),
    page,
    pageSize: PAGE_SIZE,
  };
  const list = useList<AssetRow>(query);
  const categories = useCategoryCounts();
  const categoryOptions = useOptions(CATEGORY_OPTIONS, 'category_ID', 'name');
  const vendorOptions = useOptions(VENDOR_OPTIONS, 'vendor_ID', 'name');

  const apply = () => url.set({ ...draft, page: null });
  const clear = () => url.set({ q: null, tag: null, serial: null, status: null, category: null, warranty: null, page: null });

  async function exportCsv() {
    setExporting(true);
    setMessage(null);
    try {
      const all = await odataGet<AssetRow>(listPath({ ...query, page: 1, pageSize: EXPORT_LIMIT }));
      const total = all['@odata.count'] ?? all.value.length;
      const cols = ASSET_COLUMNS.filter((c) => visible.includes(c.id));
      const text = (c: (typeof ASSET_COLUMNS)[number], r: AssetRow): unknown => {
        switch (c.id) {
          case 'assetTag': return r.assetTag;
          case 'model': return r.model;
          case 'serialNumber': return r.serialNumber;
          case 'category': return r.categoryName;
          case 'status': return STATUSES.find((s) => s.key === r.status)?.label ?? r.status;
          case 'holder': return r.holderName;
          case 'location': return r.holderLocation;
          case 'vendor': return r.vendorName;
          default: return formatDate(r.warrantyExpiry);
        }
      };
      downloadCsv('hardware-assets.csv', toCsv(cols.map((c) => c.header), all.value.map((r) => cols.map((c) => text(c, r)))));
      setMessage({
        tone: 'success',
        text: total > EXPORT_LIMIT ? `Exported the first ${EXPORT_LIMIT} of ${total} assets. Narrow the filters to export the rest.` : `Exported ${total} assets.`,
      });
    } catch (e) {
      setMessage({ tone: 'error', text: e instanceof Error ? e.message : 'The export failed.' });
    } finally {
      setExporting(false);
    }
  }

  const registering = url.get('new') === '1';

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Asset Lifecycle', href: '/launch-admin' }, { label: 'Hardware assets' }]}
        title="Hardware assets"
        subtitle="View and manage all hardware assets across the organisation."
        actions={
          <>
            <Button variant="primary" icon="plus" onClick={() => url.set({ new: '1' })}>
              Register asset
            </Button>
            <Button icon="download" onClick={exportCsv} busy={exporting}>
              Export CSV
            </Button>
          </>
        }
      />

      {message && (
        <Notice tone={message.tone} onDismiss={() => setMessage(null)}>
          {message.text}
        </Notice>
      )}

      <FilterCard
        onApply={apply}
        onClear={clear}
        moreInUse={Boolean(committed.category || committed.warranty)}
        more={
          <>
            <Field label="Category" htmlFor="f-category">
              <SelectInput
                id="f-category"
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                placeholder="All"
                options={categories.result.state === 'ready' ? categories.result.data.map((c) => ({ value: c.label, label: c.label })) : []}
              />
            </Field>
            <div style={{ alignSelf: 'end', paddingBottom: 8 }}>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}>
                <input
                  type="checkbox"
                  checked={draft.warranty === '30'}
                  onChange={(e) => setDraft({ ...draft, warranty: e.target.checked ? '30' : '' })}
                />
                Warranty ends within 30 days
              </label>
            </div>
          </>
        }
      >
        <Field label="Search assets" htmlFor="f-q">
          <TextInput id="f-q" type="search" value={draft.q} placeholder="Tag, serial, model or holder" onChange={(e) => setDraft({ ...draft, q: e.target.value })} />
        </Field>
        <Field label="Asset tag" htmlFor="f-tag">
          <TextInput id="f-tag" value={draft.tag} placeholder="Enter asset tag" onChange={(e) => setDraft({ ...draft, tag: e.target.value })} />
        </Field>
        <Field label="Serial number" htmlFor="f-serial">
          <TextInput id="f-serial" value={draft.serial} placeholder="Enter serial number" onChange={(e) => setDraft({ ...draft, serial: e.target.value })} />
        </Field>
        <Field label="Status" htmlFor="f-status">
          <SelectInput
            id="f-status"
            value={draft.status}
            onChange={(e) => setDraft({ ...draft, status: e.target.value })}
            placeholder="All"
            options={STATUSES.map((s) => ({ value: s.key, label: s.label }))}
          />
        </Field>
      </FilterCard>

      <TableCard
        title="Hardware assets"
        count={list.result.state === 'ready' ? `${list.result.data.total} ${list.result.data.total === 1 ? 'asset' : 'assets'}` : undefined}
        toolbar={
          <>
            <ColumnsMenu columns={ASSET_COLUMNS} visible={visible} onChange={setVisible} />
            <DensityMenu value={density} onChange={setDensity} />
          </>
        }
      >
        <RemoteView remote={list.result} retry={list.retry} placeholder={<Skeleton height={260} />}>
          {({ rows, total }) => (
            <>
              <DataTable
                caption="Hardware assets"
                columns={pickColumns(ASSET_COLUMNS, visible)}
                rows={rows}
                rowKey={(r) => r.asset_ID}
                sort={sort}
                onSort={(key) => url.set({ sort: sortParam({ key, dir: sort.key === key && sort.dir === 'asc' ? 'desc' : 'asc' }), page: null })}
                onRowClick={(r) => router.push(`/assets/${r.asset_ID}`)}
                compact={density === 'compact'}
                busy={list.busy}
                empty={
                  total > 0 ? (
                    <>
                      <Text tone="muted">There are no assets on this page.</Text>{' '}
                      <Button onClick={() => url.set({ page: null })}>Go to the first page</Button>
                    </>
                  ) : hasFilters(committed) ? (
                    <>
                      <Text tone="muted">No assets match these filters.</Text>{' '}
                      <Button onClick={clear}>Clear all</Button>
                    </>
                  ) : (
                    <Text tone="muted">No assets are registered yet. Use Register asset to add the first one.</Text>
                  )
                }
              />
              <Pagination page={page} pageSize={PAGE_SIZE} total={total} noun="assets" onPage={(p) => url.set({ page: String(p) })} />
            </>
          )}
        </RemoteView>
      </TableCard>

      <FormDialog
        open={registering}
        title="Register asset"
        description="New assets start In Stock. Assign them from the asset page."
        fields={assetFields(categoryOptions, vendorOptions)}
        submitLabel="Register asset"
        onSubmit={async (values) => {
          const id = newId();
          await odataSend('POST', 'createAsset', { asset_ID: id, ...assetPayload(values, false), status: 'In Stock' });
          router.push(`/assets/${id}`);
        }}
        onClose={() => url.set({ new: null })}
      />
    </div>
  );
}
