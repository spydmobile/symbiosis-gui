import { useState, useCallback, useEffect } from 'react';
import { gatewayApi } from '../../data/api';
import type { SmekbEntry, SmekbDomain, SmekbSearchResult } from '../../domain/entities';

interface UseSmekbResult {
  domains: SmekbDomain[];
  entries: SmekbEntry[];
  selectedDomain: string | null;
  setSelectedDomain: (domain: string | null) => void;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  searchSmekb: (query: string) => Promise<void>;
  searchResults: SmekbSearchResult[] | null;
  searching: boolean;
}

/**
 * Hook for fetching SMEKB knowledge base entries
 */
export function useSmekb(): UseSmekbResult {
  const [domains, setDomains] = useState<SmekbDomain[]>([]);
  const [entries, setEntries] = useState<SmekbEntry[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchResults, setSearchResults] = useState<SmekbSearchResult[] | null>(null);
  const [searching, setSearching] = useState(false);

  // Fetch domains list
  const fetchDomains = useCallback(async () => {
    try {
      const response = await gatewayApi.getDomains();
      setDomains(response.domains);
    } catch (err) {
      console.warn('Failed to fetch SMEKB domains:', err);
    }
  }, []);

  // Fetch entries for a domain
  const fetchEntries = useCallback(async (domain: string) => {
    setLoading(true);
    try {
      const response = await gatewayApi.getDomainEntries(domain);
      setEntries(response.entries);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search across all SMEKB
  const searchSmekb = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setSearching(true);
    try {
      const response = await gatewayApi.searchSmekb(
        query,
        selectedDomain || undefined,
        50
      );
      setSearchResults(response.results);
    } catch (err) {
      console.error('SMEKB search failed:', err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, [selectedDomain]);

  // Initial load - fetch domains
  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  // When domain selected, fetch entries
  useEffect(() => {
    if (selectedDomain) {
      fetchEntries(selectedDomain);
    } else {
      setEntries([]);
      setLoading(false);
    }
  }, [selectedDomain, fetchEntries]);

  const refetch = useCallback(async () => {
    await fetchDomains();
    if (selectedDomain) {
      await fetchEntries(selectedDomain);
    }
  }, [fetchDomains, fetchEntries, selectedDomain]);

  return {
    domains,
    entries,
    selectedDomain,
    setSelectedDomain,
    loading,
    error,
    refetch,
    searchSmekb,
    searchResults,
    searching,
  };
}
