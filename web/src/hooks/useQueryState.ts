'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

/**
 * Page state (search, filters, page, sort) kept in the URL, so links from the dashboard land on a filtered list
 * and the browser's Back button works. Values equal to their default are left out of the URL.
 * Pages using this must sit inside a Suspense boundary.
 */
export function useQueryState(defaults: Record<string, string>) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const get = (key: string) => params.get(key) ?? defaults[key] ?? '';

  const set = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === '' || v === defaults[k]) next.delete(k);
        else next.set(k, v);
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    // `defaults` is a module-level constant in every caller.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params, pathname, router],
  );

  return { get, set, has: (key: string) => params.has(key) };
}

/** A text box value that reaches the URL only after the user pauses typing. */
export function useDebouncedText(committed: string, commit: (value: string) => void, delay = 300) {
  const [text, setText] = useState(committed);

  useEffect(() => setText(committed), [committed]);
  useEffect(() => {
    if (text === committed) return;
    const t = setTimeout(() => commit(text), delay);
    return () => clearTimeout(t);
    // `commit` changes identity with the URL; only the text matters here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, delay]);

  return [text, setText] as const;
}
