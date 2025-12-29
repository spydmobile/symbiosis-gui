import { useState, useEffect, useCallback } from 'react';

/**
 * Generic API hook for fetching data
 */
interface UseApiOptions<T> {
  initialData?: T;
  immediate?: boolean;
}

interface UseApiResult<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  options: UseApiOptions<T> = {}
): UseApiResult<T> {
  const { initialData, immediate = true } = options;
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    if (immediate) {
      fetch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: fetch };
}

/**
 * Hook for mutation operations (create, update, delete)
 */
interface UseMutationResult<T, Args extends unknown[]> {
  mutate: (...args: Args) => Promise<T>;
  data: T | undefined;
  loading: boolean;
  error: Error | null;
  reset: () => void;
}

export function useMutation<T, Args extends unknown[]>(
  mutator: (...args: Args) => Promise<T>
): UseMutationResult<T, Args> {
  const [data, setData] = useState<T | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (...args: Args): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutator(...args);
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [mutator]);

  const reset = useCallback(() => {
    setData(undefined);
    setError(null);
  }, []);

  return { mutate, data, loading, error, reset };
}
