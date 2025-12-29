import type { UnifiedSearchResponse, Message, Handoff, JournalSearchResult, SmekbSearchResult } from '../../domain/entities';
import { Card, Badge } from '../../shared/components';
import { formatRelativeTime, truncate } from '../../shared/utils';

interface SearchResultsProps {
  results: UnifiedSearchResponse;
}

/**
 * Display unified search results grouped by type
 */
export function SearchResults({ results }: SearchResultsProps) {
  const { messages, handoffs, journals, smekb } = results.results;

  const hasResults =
    (messages?.count ?? 0) > 0 ||
    (handoffs?.count ?? 0) > 0 ||
    (journals?.count ?? 0) > 0 ||
    (smekb?.count ?? 0) > 0;

  if (!hasResults) {
    return (
      <Card variant="bordered" className="text-center py-8">
        <div className="text-text-secondary">No results found for "{results.query}"</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Messages */}
      {messages && messages.count > 0 && (
        <ResultSection
          title="Messages"
          count={messages.count}
          variant="cyan"
        >
          {messages.items.map((msg) => (
            <MessageResult key={msg.id} message={msg} />
          ))}
        </ResultSection>
      )}

      {/* Handoffs */}
      {handoffs && handoffs.count > 0 && (
        <ResultSection
          title="Handoffs"
          count={handoffs.count}
          variant="gold"
        >
          {handoffs.items.map((handoff) => (
            <HandoffResult key={handoff.id} handoff={handoff} />
          ))}
        </ResultSection>
      )}

      {/* Journals */}
      {journals && journals.count > 0 && (
        <ResultSection
          title="Journals"
          count={journals.count}
          variant="success"
        >
          {journals.items.map((journal) => (
            <JournalResult key={journal.id} journal={journal} />
          ))}
        </ResultSection>
      )}

      {/* SMEKB */}
      {smekb && smekb.count > 0 && (
        <ResultSection
          title="Knowledge Base"
          count={smekb.count}
          variant="warning"
        >
          {smekb.items.map((entry) => (
            <SmekbResult key={entry.id} entry={entry} />
          ))}
        </ResultSection>
      )}
    </div>
  );
}

interface ResultSectionProps {
  title: string;
  count: number;
  variant: 'cyan' | 'gold' | 'success' | 'warning';
  children: React.ReactNode;
}

function ResultSection({ title, count, variant, children }: ResultSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <Badge variant={variant} size="sm">{count}</Badge>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}

function MessageResult({ message }: { message: Message }) {
  return (
    <Card variant="bordered" padding="sm" className="hover:bg-space-600 transition-colors cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-text-primary">{message.from_entity}</span>
            <span className="text-text-tertiary">→</span>
            <span className="text-text-secondary">{message.to_entity}</span>
          </div>
          <div className="text-sm text-text-secondary font-medium mt-1">{message.subject}</div>
          <div className="text-sm text-text-tertiary mt-1">{truncate(message.body, 100)}</div>
        </div>
        <span className="text-xs text-text-tertiary flex-shrink-0">
          {formatRelativeTime(message.timestamp)}
        </span>
      </div>
    </Card>
  );
}

function HandoffResult({ handoff }: { handoff: Handoff }) {
  return (
    <Card variant="bordered" padding="sm" className="hover:bg-space-600 transition-colors cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-text-primary">{handoff.unicorn}</span>
            <Badge variant="gold" size="sm">handoff</Badge>
          </div>
          <div className="text-sm text-text-secondary mt-1">{handoff.focus}</div>
          {handoff.summary && (
            <div className="text-sm text-text-tertiary mt-1">{truncate(handoff.summary, 100)}</div>
          )}
        </div>
        <span className="text-xs text-text-tertiary flex-shrink-0">
          {formatRelativeTime(handoff.timestamp)}
        </span>
      </div>
    </Card>
  );
}

function JournalResult({ journal }: { journal: JournalSearchResult }) {
  return (
    <Card variant="bordered" padding="sm" className="hover:bg-space-600 transition-colors cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-text-primary">{journal.unicorn}</span>
            <Badge variant={journal.visibility === 'family' ? 'success' : 'default'} size="sm">
              {journal.visibility}
            </Badge>
          </div>
          {journal.title && (
            <div className="text-sm text-text-secondary font-medium mt-1">{journal.title}</div>
          )}
          <div
            className="text-sm text-text-tertiary mt-1"
            dangerouslySetInnerHTML={{ __html: journal.snippet || truncate(journal.content, 100) }}
          />
        </div>
        <span className="text-xs text-text-tertiary flex-shrink-0">
          {formatRelativeTime(journal.timestamp)}
        </span>
      </div>
    </Card>
  );
}

function SmekbResult({ entry }: { entry: SmekbSearchResult }) {
  return (
    <Card variant="bordered" padding="sm" className="hover:bg-space-600 transition-colors cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-text-primary">{entry.topic}</span>
            <Badge variant="warning" size="sm">{entry.domain}</Badge>
            <Badge variant="default" size="sm">v{entry.version}</Badge>
          </div>
          <div
            className="text-sm text-text-tertiary mt-1"
            dangerouslySetInnerHTML={{ __html: entry.snippet || truncate(entry.content, 100) }}
          />
        </div>
        <span className="text-xs text-text-tertiary flex-shrink-0">
          {formatRelativeTime(entry.updated)}
        </span>
      </div>
    </Card>
  );
}
