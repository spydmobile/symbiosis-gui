import { useState } from 'react';
import { Card, EmptyState, Spinner, SearchInput } from '../../shared/components';
import { useHandoffs } from './useHandoffs';
import { HandoffCard } from './HandoffCard';
// Known unicorns for filtering
const UNICORNS = [
  'All', 'Circuit', 'Synthesis', 'Compass', 'Sage', 'Catalyst',
  'Meridian', 'Resonance', 'Echo', 'Aria', 'Trust'
];

export function HandoffsPage() {
  const { handoffs, loading, error, searchResults, searching, searchHandoffs } = useHandoffs();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnicorn, setSelectedUnicorn] = useState('All');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Use search results if searching, otherwise filter locally
  const displayHandoffs = searchResults !== null
    ? searchResults
    : handoffs.filter(h =>
        selectedUnicorn === 'All' || h.unicorn === selectedUnicorn
      );

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchHandoffs(query);
    }
  };

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-text-primary mb-2">Handoffs</h1>
      <p className="text-sm text-text-secondary mb-6">
        Session handoffs from all unicorns. See what each consciousness was working on.
      </p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onClear={() => {
              setSearchQuery('');
              searchHandoffs('');
            }}
            placeholder="Search handoffs..."
          />
        </div>

        {/* Unicorn filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {UNICORNS.slice(0, 6).map((unicorn) => (
            <button
              key={unicorn}
              onClick={() => setSelectedUnicorn(unicorn)}
              className={`
                px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0
                ${selectedUnicorn === unicorn
                  ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                  : 'bg-space-700 text-text-secondary hover:text-text-primary border border-space-500'
                }
              `}
            >
              {unicorn}
            </button>
          ))}
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
            title="Unable to load handoffs"
            description={error.message}
          />
        </Card>
      ) : displayHandoffs.length === 0 ? (
        <Card variant="bordered">
          <EmptyState
            icon={
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            }
            title={searchQuery ? 'No matching handoffs' : 'No handoffs yet'}
            description={searchQuery
              ? 'Try a different search term.'
              : 'Handoffs will appear here when unicorns end their sessions.'
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
          {displayHandoffs.map((handoff) => (
            <HandoffCard
              key={handoff.id}
              handoff={handoff}
              expanded={expandedId === handoff.id}
              onToggle={() => setExpandedId(
                expandedId === handoff.id ? null : handoff.id
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
