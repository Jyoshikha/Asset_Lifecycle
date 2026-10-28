'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type Remote<T> =
  | { state: 'loading' }
  | { state: 'error'; message: string }
  | { state: 'ready'; data: T };

/** Derives one remote value from another without losing its loading or error state. */
export function mapRemote<A, B>(remote: Remote<A>, fn: (data: A) => B): Remote<B> {
  return remote.state === 'ready' ? { state: 'ready', data: fn(remote.data) } : remote;
}

/**
 * Runs a loader on mount, when `key` changes, and on retry. Failures are reported, never turned into empty data.
 * While a newer request is in flight the previous data stays visible and `busy` is true, so lists do not flash.
 */
export function useRemote<T>(
  load: (signal: AbortSignal) => Promise<T>,
  key = '',
): { result: Remote<T>; retry: () => void; busy: boolean } {
  const [result, setResult] = useState<Remote<T>>({ state: 'loading' });
  const [busy, setBusy] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    const controller = new AbortController();
    setBusy(true);
    loadRef.current(controller.signal).then(
      (data) => {
        if (controller.signal.aborted) return;
        setResult({ state: 'ready', data });
        setBusy(false);
      },
      (e: unknown) => {
        if (controller.signal.aborted) return;
        setResult({ state: 'error', message: e instanceof Error ? e.message : 'Request failed' });
        setBusy(false);
      },
    );
    return () => controller.abort();
  }, [attempt, key]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { result, retry, busy };
}
