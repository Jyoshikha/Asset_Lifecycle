'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { DataTable, type Column } from '@/components/ui/DataTable';
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
import { useList, useLookup } from '@/hooks/useList';
import { useQueryState } from '@/hooks/useQueryState';
import { odataSend } from '@/lib/odata';
import { newId, orderBy, parseSort, quote, searchFilter, sortParam } from '@/lib/query';
import type { Option } from '@/types/odata';
import { str } from './entities';
import type { MasterConfig, Row, SelectFilter } from './types';

const PAGE_SIZE = 25;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Options of one lookup (for example departments); an empty list until it arrives. */
function useLookupOptions(lookup: { path: string; value: string; label: string } | undefined): Option[] {
  const { result } = useLookup<Record<string, string | null>>(lookup?.path ?? null);
  if (!lookup || result.state !== 'ready') return [];
  return result.data.map((r) => ({ value: String(r[lookup.value] ?? ''), label: String(r[lookup.label] ?? '') }));
}

function FilterSelect({ filter, value, onChange }: { filter: SelectFilter; value: string; onChange: (v: string) => void }) {
  const looked = useLookupOptions(filter.lookup);
  return (
    <Field label={filter.label} htmlFor={`f-${filter.key}`}>
      <SelectInput id={`f-${filter.key}`} value={value} onChange={(e) => onChange(e.target.value)} placeholder="All" options={filter.options ?? looked} />
    </Field>
  );
}

/** A filter value from the URL becomes a $filter part only if it is one of the allowed values. */
function selectFilterPart(f: SelectFilter, value: string): string | null {
  if (!value) return null;
  if (f.options) return f.options.some((o) => o.value === value) ? `${f.field} eq ${quote(value)}` : null;
  return UUID.test(value) ? `${f.field} eq ${value}` : null;
}

export function MasterListPage({ config }: { config: MasterConfig }) {
  const defaults: Record<string, string> = { q: '', page: '1', sort: config.defaultSort, new: '' };
  for (const f of config.selectFilters) defaults[f.key] = '';
  const url = useQueryState(defaults);

  const committed: Record<string, string> = { q: url.get('q') };
  for (const f of config.selectFilters) committed[f.key] = url.get(f.key);
  const sort = parseSort(url.get('sort'), config.sortFields, config.defaultSort);
  const page = Math.max(1, parseInt(url.get('page'), 10) || 1);

  const [draft, setDraft] = useState(committed);
  const committedKey = JSON.stringify(committed);
  useEffect(() => setDraft(JSON.parse(committedKey) as Record<string, string>), [committedKey]);

  const [visible, setVisible] = useState(config.columns.map((c) => c.id));
  const [density, setDensity] = useState<Density>('comfortable');
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);

  const filters = [
    ...(config.baseFilter ? [config.baseFilter] : []),
    ...[searchFilter(config.searchFields, committed.q ?? '')].flatMap((p) => (p ? [p] : [])),
    ...config.selectFilters.flatMap((f) => {
      const part = selectFilterPart(f, committed[f.key] ?? '');
      return part ? [part] : [];
    }),
  ];
  const filtered = filters.length > (config.baseFilter ? 1 : 0);

  const list = useList<Row>({
    entity: config.entity,
    select: config.select,
    expand: config.expand,
    filters,
    orderBy: orderBy(sort, config.idField),
    page,
    pageSize: PAGE_SIZE,
  });

  // Lookup lists for the form (for example departments), loaded once.
  const departments = useLookupOptions(config.formLookups.department_dept_ID);
  const lookups: Record<string, Option[]> = { department_dept_ID: departments };

  const apply = () => url.set({ ...draft, page: null });
  const clear = () => url.set({ q: null, page: null, ...Object.fromEntries(config.selectFilters.map((f) => [f.key, null])) });

  const actionColumn: Column<Row> = {
    id: 'actions',
    header: 'Actions',
    align: 'right',
    nowrap: true,
    render: (r) => (
      <span style={{ display: 'inline-flex', gap: 8 }}>
        <Button onClick={() => setEditing(r)}>Edit<span className="sr-only"> {str(r, config.titleField)}</span></Button>
        {config.canDelete === true && (
          <Button variant="danger" onClick={() => setDeleting(r)}>
            Delete<span className="sr-only"> {str(r, config.titleField)}</span>
          </Button>
        )}
      </span>
    ),
  };

  const cap = config.singular.charAt(0).toUpperCase() + config.singular.slice(1);

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Asset Lifecycle', href: '/launch-admin' }, { label: config.title }]}
        title={config.title}
        subtitle={config.subtitle}
        actions={
          <Button variant="primary" icon="plus" onClick={() => url.set({ new: '1' })}>
            Add {config.singular}
          </Button>
        }
      />

      {message && (
        <Notice tone="success" onDismiss={() => setMessage('')}>
          {message}
        </Notice>
      )}
      {config.canDelete !== true && (
        <Text tone="muted" size="sm">
          {config.canDelete}
        </Text>
      )}

      <FilterCard onApply={apply} onClear={clear}>
        <Field label={`Search ${config.plural}`} htmlFor="f-q">
          <TextInput id="f-q" type="search" value={draft.q ?? ''} placeholder={config.searchPlaceholder} onChange={(e) => setDraft({ ...draft, q: e.target.value })} />
        </Field>
        {config.selectFilters.map((f) => (
          <FilterSelect key={f.key} filter={f} value={draft[f.key] ?? ''} onChange={(v) => setDraft({ ...draft, [f.key]: v })} />
        ))}
      </FilterCard>

      <TableCard
        title={config.title}
        count={list.result.state === 'ready' ? `${list.result.data.total} ${list.result.data.total === 1 ? config.singular : config.plural}` : undefined}
        toolbar={
          <>
            <ColumnsMenu columns={config.columns} visible={visible} onChange={setVisible} />
            <DensityMenu value={density} onChange={setDensity} />
          </>
        }
      >
        <RemoteView remote={list.result} retry={list.retry} placeholder={<Skeleton height={220} />}>
          {({ rows, total }) => (
            <>
              <DataTable
                caption={config.title}
                columns={[...pickColumns(config.columns, visible), actionColumn]}
                rows={rows}
                rowKey={(r) => str(r, config.idField)}
                sort={sort}
                onSort={(key) => url.set({ sort: sortParam({ key, dir: sort.key === key && sort.dir === 'asc' ? 'desc' : 'asc' }), page: null })}
                compact={density === 'compact'}
                busy={list.busy}
                empty={
                  total > 0 ? (
                    <>
                      <Text tone="muted">There are no {config.plural} on this page.</Text> <Button onClick={() => url.set({ page: null })}>Go to the first page</Button>
                    </>
                  ) : filtered ? (
                    <>
                      <Text tone="muted">No {config.plural} match these filters.</Text> <Button onClick={clear}>Clear all</Button>
                    </>
                  ) : (
                    <Text tone="muted">No {config.plural} yet. Use Add {config.singular} to create the first one.</Text>
                  )
                }
              />
              <Pagination page={page} pageSize={PAGE_SIZE} total={total} noun={config.plural} onPage={(p) => url.set({ page: String(p) })} />
            </>
          )}
        </RemoteView>
      </TableCard>

      <FormDialog
        open={url.get('new') === '1'}
        title={`Add ${config.singular}`}
        fields={config.fields(lookups)}
        initial={config.initial({})}
        submitLabel={`Add ${config.singular}`}
        onSubmit={async (values) => {
          await odataSend('POST', config.createAction, { [config.idField]: newId(), ...config.payload(values) });
          setMessage(`${cap} added.`);
          list.retry();
        }}
        onClose={() => url.set({ new: null })}
      />

      {editing && (
        <FormDialog
          open
          title={`Edit ${config.singular}`}
          fields={config.fields(lookups)}
          initial={config.initial(editing)}
          submitLabel="Save changes"
          onSubmit={async (values) => {
            await odataSend('POST', config.updateAction, { [config.idField]: str(editing, config.idField), ...config.payload(values) });
            setMessage(`${cap} updated.`);
            list.retry();
          }}
          onClose={() => setEditing(null)}
        />
      )}

      {deleting && (
        <FormDialog
          open
          title={`Delete ${config.singular}`}
          description={`Delete ${str(deleting, config.titleField)}? This cannot be undone.`}
          fields={[]}
          submitLabel="Delete"
          danger
          onSubmit={async () => {
            await odataSend('DELETE', `${config.entity}(${config.idField}=${str(deleting, config.idField)},IsActiveEntity=true)`);
            setMessage(`${cap} deleted.`);
            list.retry();
          }}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
