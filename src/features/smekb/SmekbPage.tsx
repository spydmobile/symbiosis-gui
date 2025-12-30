import { useState } from 'react';
import { Card, EmptyState, Spinner, SearchInput, Badge } from '../../shared/components';
import { useSmekb } from './useSmekb';
import { SmekbCard } from './SmekbCard';

export function SmekbPage() {
  const {
    domains,
    entries,
    selectedDomain,
    setSelectedDomain,
    loading,
    error,
    searchResults,
    searching,
    searchSmekb,
  } = useSmekb();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const displayEntries = searchResults !== null ? searchResults : entries;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchSmekb(query);
    }
  };

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-text-primary mb-2">Knowledge Base</h1>
      <p className="text-sm text-text-secondary mb-6">
        Shared Memory and Empirical Knowledge Base (SMEKB)
      </p>

      {/* Search */}
      <div className="mb-6">
        <SearchInput
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onClear={() => {
            setSearchQuery('');
            searchSmekb('');
          }}
          placeholder="Search knowledge base..."
        />
      </div>

      {/* Domain selector */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-1 -mx-4 px-4 md:mx-0 md:px-0">
        <button
          onClick={() => setSelectedDomain(null)}
          className={`
            px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0
            ${selectedDomain === null
              ? 'bg-status-warning/20 text-status-warning border border-status-warning/30'
              : 'bg-space-700 text-text-secondary hover:text-text-primary border border-space-500'
            }
          `}
        >
          All Domains
        </button>
        {domains.map((domain) => (
          <button
            key={domain.domain}
            onClick={() => setSelectedDomain(domain.domain)}
            className={`
              px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0
              ${selectedDomain === domain.domain
                ? 'bg-status-warning/20 text-status-warning border border-status-warning/30'
                : 'bg-space-700 text-text-secondary hover:text-text-primary border border-space-500'
              }
            `}
          >
            {domain.domain}
            <Badge variant="default" size="sm">{domain.entry_count}</Badge>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && !searchResults ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <Card variant="bordered">
          <EmptyState
            icon={
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
            title="Unable to load knowledge base"
            description={error.message}
          />
        </Card>
      ) : !selectedDomain && !searchQuery ? (
        <Card variant="bordered">
          <EmptyState
            icon={
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            }
            title="Select a domain"
            description="Choose a knowledge domain above or search to browse entries."
          />
        </Card>
      ) : displayEntries.length === 0 ? (
        <Card variant="bordered">
          <EmptyState
            icon={
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            }
            title={searchQuery ? 'No matching entries' : 'No entries in this domain'}
            description={searchQuery
              ? 'Try a different search term.'
              : 'Knowledge entries will appear here when unicorns add them.'
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {searching && (
            <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
              <Spinner size="sm" />
              Searching...
            </div>
          )}
          {displayEntries.map((entry) => (
            <SmekbCard
              key={entry.id}
              entry={entry}
              expanded={expandedId === entry.id}
              onToggle={() => setExpandedId(
                expandedId === entry.id ? null : entry.id
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
