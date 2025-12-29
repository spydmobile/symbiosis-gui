import { useState, useCallback, useEffect } from 'react';
import { gatewayApi } from '../../data/api';
import type { Journal, JournalSearchResult, UnifiedSearchResponse } from '../../domain/entities';

interface UseJournalsResult {
  journals: Journal[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  searchJournals: (query: string) => Promise<void>;
  searchResults: JournalSearchResult[] | null;
  searching: boolean;
}

/**
 * Hook for fetching journals
 * Uses gateway_search to get all journals (admin view)
 */
export function useJournals(): UseJournalsResult {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchResults, setSearchResults] = useState<JournalSearchResult[] | null>(null);
  const [searching, setSearching] = useState(false);

  const fetchJournals = useCallback(async () => {
    setLoading(true);
    try {
      // Use gateway search to get all journals
      const response: UnifiedSearchResponse = await gatewayApi.search({
        query: '*',
        type: 'journals',
        limit: 100,
      });

      if (response.results.journals) {
        setJournals(response.results.journals.items as Journal[]);
      }
      setError(null);
    } catch (err) {
      console.warn('Journals search failed:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  const searchJournals = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setSearching(true);
    try {
      const response = await gatewayApi.search({
        query,
        type: 'journals',
        limit: 50,
      });

      if (response.results.journals) {
        setSearchResults(response.results.journals.items);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Journal search failed:', err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    fetchJournals();
  }, [fetchJournals]);

  return {
    journals,
    loading,
    error,
    refetch: fetchJournals,
    searchJournals,
    searchResults,
    searching,
  };
}
