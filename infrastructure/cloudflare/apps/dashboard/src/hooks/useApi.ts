/**
 * useApi — lightweight data-fetching hook backed by the API client.
 *
 * Supports:
 *   - Initial load
 *   - Manual refresh via `refetch()`
 *   - Error state
 *   - Loading state
 *
 * Does NOT implement caching/deduplication — a proper SWR or React Query
 * integration is a post-launch enhancement.
 */
import { useState, useEffect, useCallback } from "react";

export interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetcher()
      .then((d) => { if (!cancelled) { setData(d); setIsLoading(false); } })
      .catch((e: unknown) => { if (!cancelled) { setError(e instanceof Error ? e : new Error(String(e))); setIsLoading(false); } });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, ...deps]);

  return { data, isLoading, error, refetch };
}
