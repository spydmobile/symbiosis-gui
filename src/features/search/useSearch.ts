import { useState, useCallback } from 'react';
import { gatewayApi } from '../../data/api';
import { useDebounce } from '../../shared/hooks';
import type { UnifiedSearchResponse, UnifiedSearchRequest } from '../../domain/entities';

type SearchType = 'all' | 'messages' | 'handoffs' | 'journals' | 'smekb';

interface UseSearchResult {
  query: string;
  setQuery: (query: string) => void;
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
  results: UnifiedSearchResponse | null;
  loading: boolean;
  error: Error | null;
  search: () => Promise<void>;
  hasSearched: boolean;
}

/**
 * Hook for unified search across all content types
 */
export function useSearch(): UseSearchResult {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [results, setResults] = useState<UnifiedSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  const search = useCallback(async () => {
    if (!debouncedQuery.trim()) {
      setResults(null);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const request: UnifiedSearchRequest = {
        query: debouncedQuery,
        type: searchType === 'all' ? undefined : searchType,
        limit: 20,
        admin: true, // Admin GUI - bypass access control
      };

      const response = await gatewayApi.search(request);
      setResults(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, searchType]);

  return {
    query,
    setQuery,
    searchType,
    setSearchType,
    results,
    loading,
    error,
    search,
    hasSearched,
  };
}
