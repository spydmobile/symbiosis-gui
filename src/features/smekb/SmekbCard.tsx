import type { SmekbEntry, SmekbSearchResult } from '../../domain/entities';
import { Card, Badge } from '../../shared/components';
import { formatRelativeTime } from '../../shared/utils';

interface SmekbCardProps {
  entry: SmekbEntry | SmekbSearchResult;
  expanded?: boolean;
  onToggle?: () => void;
}

/**
 * Display a single SMEKB knowledge entry
 */
export function SmekbCard({ entry, expanded = false, onToggle }: SmekbCardProps) {
  const hasSnippet = 'snippet' in entry && entry.snippet;

  return (
    <Card
      variant="bordered"
      padding="none"
      className="hover:border-status-warning/30 transition-colors"
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
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-text-primary">{entry.topic}</span>
            <Badge variant="warning" size="sm">{entry.domain}</Badge>
            <Badge variant="default" size="sm">v{entry.version}</Badge>
          </div>

          {/* Preview - either snippet or truncated content */}
          <div
            className="text-sm text-text-tertiary line-clamp-2"
            dangerouslySetInnerHTML={{
              __html: hasSnippet
                ? (entry as SmekbSearchResult).snippet
                : entry.content.slice(0, 150) + (entry.content.length > 150 ? '...' : '')
            }}
          />

          {/* Author */}
          <div className="text-xs text-text-tertiary mt-2">
            by {entry.author}
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex-shrink-0 text-right">
          <div className="text-xs text-text-tertiary">
            {formatRelativeTime(entry.updated)}
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-space-500 p-4">
          <div className="prose prose-sm prose-invert max-w-none">
            <pre className="text-sm text-text-secondary whitespace-pre-wrap bg-space-800 p-4 rounded-lg overflow-x-auto">
              {entry.content}
            </pre>
          </div>
        </div>
      )}
    </Card>
  );
}
