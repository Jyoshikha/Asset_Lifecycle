import type { ODataList } from '@/types/odata';

// Same-origin: next.config.ts proxies /odata to the CAP backend.
const SERVICE = '/odata/v4/catalog';

export class ODataError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function failure(res: Response): Promise<ODataError> {
  let message = res.statusText || `Request failed (${res.status})`;
  try {
    message = (await res.json()).error?.message ?? message;
  } catch {
    /* keep the status text */
  }
  return new ODataError(res.status, message);
}

export async function odataGet<T>(path: string, signal?: AbortSignal): Promise<ODataList<T>> {
  const res = await fetch(`${SERVICE}/${path}`, {
    headers: { Accept: 'application/json' },
    credentials: 'same-origin',
    signal,
  });
  if (!res.ok) throw await failure(res);
  return res.json();
}

/** One entity addressed by key, e.g. `AssetSrv(asset_ID=...,IsActiveEntity=true)`. */
export async function odataEntity<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${SERVICE}/${path}`, {
    headers: { Accept: 'application/json' },
    credentials: 'same-origin',
    signal,
  });
  if (!res.ok) throw await failure(res);
  return res.json();
}

/** Count of rows matching a filter, computed by the server (no row limit applies). */
export async function odataCount(entity: string, filter: string, signal?: AbortSignal): Promise<number> {
  const q = `${entity}?$filter=${encodeURIComponent(filter)}&$count=true&$top=0`;
  const data = await odataGet<unknown>(q, signal);
  return data['@odata.count'] ?? 0;
}

/** Actions (POST) and deletes. The service's own message is passed on when it refuses. */
export async function odataSend(method: 'POST' | 'DELETE', path: string, body?: unknown): Promise<void> {
  const res = await fetch(`${SERVICE}/${path}`, {
    method,
    headers: { Accept: 'application/json', ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
    credentials: 'same-origin',
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw await failure(res);
}
