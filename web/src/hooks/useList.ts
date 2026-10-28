'use client';

import { odataGet } from '@/lib/odata';
import { listPath, type ListQuery } from '@/lib/query';
import { useRemote } from './useOData';

export type ListPage<T> = { rows: T[]; total: number };

/** One server-paged, server-filtered list. The query object may change on every render; only its content matters. */
export function useList<T>(query: ListQuery) {
  return useRemote<ListPage<T>>(
    (signal) =>
      odataGet<T>(listPath(query), signal).then((r) => ({ rows: r.value, total: r['@odata.count'] ?? r.value.length })),
    JSON.stringify(query),
  );
}

/** Rows of a lookup list (for example employees for a select), loaded once. */
export function useLookup<T>(path: string | null) {
  return useRemote<T[]>(
    path ? (signal) => odataGet<T>(path, signal).then((r) => r.value) : () => Promise.resolve([]),
    path ?? '',
  );
}
