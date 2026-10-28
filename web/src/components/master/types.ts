import type { Column } from '@/components/ui/DataTable';
import type { FieldDef } from '@/components/ui/FormDialog';
import type { Option } from '@/types/odata';

export type Row = Record<string, unknown>;

/** A select filter above the table. `field` is the service field it filters on. */
export type SelectFilter = {
  key: string;
  label: string;
  field: string;
  /** Fixed choices, or a lookup list loaded from the service (then values must be ids). */
  options?: Option[];
  lookup?: Lookup;
};

export type Lookup = { path: string; value: string; label: string };

/** Everything that differs between the master-data pages; the page itself is shared. */
export type MasterConfig = {
  slug: string;
  title: string;
  subtitle: string;
  /** "employee" / "employees": used in messages and button labels. */
  singular: string;
  plural: string;
  entity: string;
  idField: string;
  /** The field that names a row (for button labels and messages). */
  titleField: string;
  select: string[];
  expand?: string;
  /** Always applied; draft-enabled entities need IsActiveEntity so that only saved records are listed. */
  baseFilter?: string;
  searchFields: string[];
  searchPlaceholder: string;
  sortFields: string[];
  defaultSort: string;
  columns: Column<Row>[];
  selectFilters: SelectFilter[];
  fields: (lookups: Record<string, Option[]>) => FieldDef[];
  /** Lookup lists the form needs, by field name. */
  formLookups: Record<string, Lookup>;
  createAction: string;
  updateAction: string;
  /** true: Delete is offered. A string: it is not, and this is why. */
  canDelete: true | string;
  /** Form values to the service's field types. */
  payload: (values: Record<string, string>) => Record<string, unknown>;
  /** Form values for an existing row. */
  initial: (row: Row) => Record<string, string>;
};
