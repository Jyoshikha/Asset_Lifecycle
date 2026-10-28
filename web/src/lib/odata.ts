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

export async function odataGet<T>(path: string, signal?: AbortSignal): Promise<ODataList<T>> {
  const res = await fetch(`${SERVICE}/${path}`, {
    headers: { Accept: 'application/json' },
    credentials: 'same-origin',
    signal,
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      message = (await res.json()).error?.message ?? message;
    } catch {
      /* keep status text */
    }
    throw new ODataError(res.status, message);
  }
  return res.json();
}

/** Count of rows matching a filter, computed by the server (no row limit applies). */
export async function odataCount(entity: string, filter: string, signal?: AbortSignal): Promise<number> {
  const q = `${entity}?$filter=${encodeURIComponent(filter)}&$count=true&$top=0`;
  const data = await odataGet<unknown>(q, signal);
  return data['@odata.count'] ?? 0;
}
