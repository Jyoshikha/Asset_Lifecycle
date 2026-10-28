const enc = encodeURIComponent;

export type ListQuery = {
  entity: string;
  select?: string[];
  expand?: string;
  filters?: string[];
  orderBy?: string;
  page: number;
  pageSize: number;
};

/** Escapes a value for use inside an OData string literal. */
export const quote = (s: string) => `'${s.replace(/'/g, "''")}'`;

/** Case-insensitive "contains" across several fields; null when there is nothing to search for. */
export function searchFilter(fields: string[], term: string): string | null {
  const t = term.trim().toLowerCase();
  if (!t) return null;
  return `(${fields.map((f) => `contains(tolower(${f}),${quote(t)})`).join(' or ')})`;
}

export function listPath(q: ListQuery): string {
  const parts: string[] = [];
  if (q.select?.length) parts.push(`$select=${enc(q.select.join(','))}`);
  if (q.expand) parts.push(`$expand=${enc(q.expand)}`);
  if (q.filters?.length) parts.push(`$filter=${enc(q.filters.join(' and '))}`);
  if (q.orderBy) parts.push(`$orderby=${enc(q.orderBy)}`);
  parts.push('$count=true', `$top=${q.pageSize}`, `$skip=${(q.page - 1) * q.pageSize}`);
  return `${q.entity}?${parts.join('&')}`;
}

export type Sort = { key: string; dir: 'asc' | 'desc' };

/** "-name" means descending. Only keys in `allowed` are accepted, since the value comes from the URL. */
export function parseSort(value: string, allowed: string[], fallback: string): Sort {
  const dir = value.startsWith('-') ? 'desc' : 'asc';
  const key = value.replace(/^-/, '');
  return allowed.includes(key) ? { key, dir } : { key: fallback, dir: 'asc' };
}

export const sortParam = (s: Sort) => (s.dir === 'desc' ? `-${s.key}` : s.key);
export const orderBy = (s: Sort, tiebreak?: string) =>
  `${s.key} ${s.dir}${tiebreak ? `,${tiebreak} asc` : ''}`;

export function newId(): string {
  return crypto.randomUUID();
}
