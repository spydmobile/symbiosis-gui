import { useCallback, useEffect, useState } from 'react';
import { gatewayApi } from '../../data/api';
import { useInterval } from '../../shared/hooks';
import type { PresenceResponse, PresenceInfo } from '../../domain/entities';

// Poll every 30 seconds
const POLL_INTERVAL = 30000;

interface UsePresenceResult {
  active: PresenceInfo[];
  idle: PresenceInfo[];
  offline: PresenceInfo[];
  summary: {
    active_count: number;
    idle_count: number;
    offline_count: number;
  };
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and auto-refreshing presence data
 */
export function usePresence(): UsePresenceResult {
  const [data, setData] = useState<PresenceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPresence = useCallback(async () => {
    try {
      const result = await gatewayApi.getPresence();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPresence();
  }, [fetchPresence]);

  // Auto-refresh
  useInterval(fetchPresence, POLL_INTERVAL);

  return {
    active: data?.active ?? [],
    idle: data?.idle ?? [],
    offline: data?.offline ?? [],
    summary: data?.summary ?? { active_count: 0, idle_count: 0, offline_count: 0 },
    loading,
    error,
    refetch: fetchPresence,
  };
}
