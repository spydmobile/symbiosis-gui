import { useState, useCallback, useEffect } from 'react';
import { gatewayApi } from '../../data/api';
import type { Handoff } from '../../domain/entities';

interface UseHandoffsResult {
  handoffs: Handoff[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  searchHandoffs: (query: string) => Promise<void>;
  searchResults: Handoff[] | null;
  searching: boolean;
}

/**
 * Hook for fetching handoffs
 * Uses dedicated /sessions/handoffs endpoint
 */
export function useHandoffs(): UseHandoffsResult {
  const [handoffs, setHandoffs] = useState<Handoff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchResults, setSearchResults] = useState<Handoff[] | null>(null);
  const [searching, setSearching] = useState(false);

  const fetchHandoffs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await gatewayApi.getHandoffs(undefined, 100);
      setHandoffs(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch handoffs:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  const searchHandoffs = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setSearching(true);
    try {
      const response = await gatewayApi.search({
        query,
        type: 'handoffs',
        limit: 50,
      });

      if (response.results.handoffs) {
        setSearchResults(response.results.handoffs.items);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Handoff search failed:', err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    fetchHandoffs();
  }, [fetchHandoffs]);

  return {
    handoffs,
    loading,
    error,
    refetch: fetchHandoffs,
    searchHandoffs,
    searchResults,
    searching,
  };
}
