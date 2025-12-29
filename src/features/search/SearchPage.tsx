import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, EmptyState, Spinner, Badge } from '../../shared/components';
import { useSearch } from './useSearch';
import { SearchResults } from './SearchResults';

const SEARCH_TYPES = [
  { id: 'all', label: 'All' },
  { id: 'messages', label: 'Messages' },
  { id: 'handoffs', label: 'Handoffs' },
  { id: 'journals', label: 'Journals' },
  { id: 'smekb', label: 'Knowledge' },
] as const;

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const {
    query,
    setQuery,
    searchType,
    setSearchType,
    results,
    loading,
    error,
    search,
    hasSearched,
  } = useSearch();

  // Initialize query from URL param when URL changes
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery) {
      setQuery(urlQuery);
    }
  }, [searchParams, setQuery]);

  // Auto-search when query or type changes
  useEffect(() => {
    if (query.trim()) {
      search();
    }
  }, [query, searchType, search]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Search</h1>

      {/* Search input */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-text-tertiary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages, handoffs, journals, and knowledge..."
            className="w-full pl-12 pr-4 py-3 text-lg rounded-lg bg-space-700 border border-space-500 text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            autoFocus
          />
          {loading && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <Spinner size="sm" />
            </div>
          )}
        </div>
      </div>

      {/* Type filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {SEARCH_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => setSearchType(type.id as typeof searchType)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${searchType === type.id
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-space-700 text-text-secondary hover:text-text-primary border border-space-500'
              }
            `}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {error ? (
        <Card variant="bordered">
          <div className="text-center py-8">
            <div className="text-status-error mb-2">Search failed</div>
            <p className="text-text-secondary text-sm">{error.message}</p>
          </div>
        </Card>
      ) : results ? (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-text-secondary">
              Found {results.total_count} results for
            </span>
            <Badge variant="cyan">"{results.query}"</Badge>
          </div>
          <SearchResults results={results} />
        </div>
      ) : hasSearched && !loading ? (
        <Card variant="bordered">
          <EmptyState
            icon={
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
            title="No results"
            description="Try a different search term or filter."
          />
        </Card>
      ) : !hasSearched ? (
        <Card variant="bordered">
          <EmptyState
            icon={
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
            title="Google for Symbiosis"
            description="Search across all messages, handoffs, journals, and knowledge entries."
          />
        </Card>
      ) : null}
    </div>
  );
}
