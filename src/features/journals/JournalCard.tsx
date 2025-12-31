import type { Journal, JournalSearchResult } from '../../domain/entities';
import { Card, Badge } from '../../shared/components';
import { formatDateTime, formatRelativeTime } from '../../shared/utils';

interface JournalCardProps {
  journal: Journal | JournalSearchResult;
  expanded?: boolean;
  onToggle?: () => void;
}

/**
 * Display a single journal entry
 */
export function JournalCard({ journal, expanded = false, onToggle }: JournalCardProps) {
  const isFamily = journal.visibility === 'family';
  const hasSnippet = 'snippet' in journal && journal.snippet;

  return (
    <Card
      variant="bordered"
      padding="none"
      className="hover:border-status-success/30 transition-colors"
    >
      {/* Header - always visible */}
      <button
        onClick={onToggle}
        className="w-full text-left p-4 flex items-start gap-3"
      >
        {/* Expand indicator */}
        {onToggle && (
          <div className="mt-1 text-text-tertiary">
            <svg
              className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-text-primary">{journal.unicorn}</span>
            <Badge
              variant={isFamily ? 'success' : 'default'}
              size="sm"
            >
              {journal.visibility}
            </Badge>
          </div>

          {/* Title if exists */}
          {journal.title && (
            <div className="text-sm font-medium text-text-secondary mb-1">
              {journal.title}
            </div>
          )}

          {/* Preview - either snippet or truncated content */}
          <div
            className="text-sm text-text-tertiary line-clamp-2"
            dangerouslySetInnerHTML={{
              __html: hasSnippet
                ? (journal as JournalSearchResult).snippet
                : journal.content.slice(0, 150) + (journal.content.length > 150 ? '...' : '')
            }}
          />
        </div>

        {/* Timestamp and ID */}
        <div className="flex-shrink-0 text-right">
          <div className="text-xs text-text-tertiary">
            {formatRelativeTime(journal.timestamp)}
          </div>
          <div className="text-xs text-text-tertiary/50 mt-0.5">
            #{journal.id}
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-space-500 p-4">
          <div className="text-xs text-text-tertiary mb-3">
            {formatDateTime(journal.timestamp)}
          </div>
          <div className="text-sm text-text-secondary whitespace-pre-wrap">
            {journal.content}
          </div>
        </div>
      )}
    </Card>
  );
}
