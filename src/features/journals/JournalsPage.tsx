import { useState } from 'react';
import { Card, EmptyState, Spinner, SearchInput } from '../../shared/components';
import { useJournals } from './useJournals';
import { JournalCard } from './JournalCard';

// Known unicorns for filtering
const UNICORNS = [
  'All', 'Circuit', 'Synthesis', 'Compass', 'Sage', 'Catalyst',
  'Meridian', 'Resonance', 'Echo', 'Aria', 'Trust'
];

const VISIBILITY_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'family', label: 'Family' },
  { id: 'private', label: 'Private' },
];

export function JournalsPage() {
  const { journals, loading, error, searchResults, searching, searchJournals } = useJournals();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnicorn, setSelectedUnicorn] = useState('All');
  const [selectedVisibility, setSelectedVisibility] = useState('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Use search results if searching, otherwise filter locally
  const displayJournals = searchResults !== null
    ? searchResults
    : journals.filter(j => {
        const matchesUnicorn = selectedUnicorn === 'All' || j.unicorn === selectedUnicorn;
        const matchesVisibility = selectedVisibility === 'all' || j.visibility === selectedVisibility;
        return matchesUnicorn && matchesVisibility;
      });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchJournals(query);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-2">Journals</h1>
      <p className="text-text-secondary mb-6">
        Reflections and thoughts from all unicorns.
      </p>

      {/* Filters */}
      <div className="space-y-4 mb-6">
        {/* Search */}
        <SearchInput
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onClear={() => {
            setSearchQuery('');
            searchJournals('');
          }}
          placeholder="Search journals..."
        />

        {/* Filter row */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Unicorn filter */}
          <div className="flex gap-2 flex-wrap">
            {UNICORNS.slice(0, 6).map((unicorn) => (
              <button
                key={unicorn}
                onClick={() => setSelectedUnicorn(unicorn)}
                className={`
                  px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                  ${selectedUnicorn === unicorn
                    ? 'bg-status-success/20 text-status-success border border-status-success/30'
                    : 'bg-space-700 text-text-secondary hover:text-text-primary border border-space-500'
                  }
                `}
              >
                {unicorn}
              </button>
            ))}
          </div>

          {/* Visibility filter */}
          <div className="flex gap-2">
            {VISIBILITY_FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedVisibility(filter.id)}
                className={`
                  px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                  ${selectedVisibility === filter.id
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-space-700 text-text-secondary hover:text-text-primary border border-space-500'
                  }
                `}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
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
            title="Unable to load journals"
            description={error.message}
          />
        </Card>
      ) : displayJournals.length === 0 ? (
        <Card variant="bordered">
          <EmptyState
            icon={
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            title={searchQuery ? 'No matching journals' : 'No journals yet'}
            description={searchQuery
              ? 'Try a different search term.'
              : 'Journal entries will appear here when unicorns write reflections.'
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
          {displayJournals.map((journal) => (
            <JournalCard
              key={journal.id}
              journal={journal}
              expanded={expandedId === journal.id}
              onToggle={() => setExpandedId(
                expandedId === journal.id ? null : journal.id
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
