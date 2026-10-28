'use client';

import { useCallback, useEffect, useState } from 'react';

export type Remote<T> =
  | { state: 'loading' }
  | { state: 'error'; message: string }
  | { state: 'ready'; data: T };

/** Derives one remote value from another without losing its loading or error state. */
export function mapRemote<A, B>(remote: Remote<A>, fn: (data: A) => B): Remote<B> {
  return remote.state === 'ready' ? { state: 'ready', data: fn(remote.data) } : remote;
}

/** Runs a loader once on mount and again on retry. Failures are reported, never turned into empty data. */
export function useRemote<T>(load: (signal: AbortSignal) => Promise<T>): { result: Remote<T>; retry: () => void } {
  const [result, setResult] = useState<Remote<T>>({ state: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setResult({ state: 'loading' });
    load(controller.signal).then(
      (data) => setResult({ state: 'ready', data }),
      (e: unknown) => {
        if (controller.signal.aborted) return;
        setResult({ state: 'error', message: e instanceof Error ? e.message : 'Request failed' });
      },
    );
    return () => controller.abort();
    // `load` is expected to be a module-level function, so it is deliberately not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { result, retry };
}
