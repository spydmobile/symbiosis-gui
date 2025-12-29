import type { Handoff } from '../../domain/entities';
import { Card, Badge } from '../../shared/components';
import { formatDateTime, formatRelativeTime } from '../../shared/utils';

interface HandoffCardProps {
  handoff: Handoff;
  expanded?: boolean;
  onToggle?: () => void;
}

/**
 * Display a single handoff entry
 */
export function HandoffCard({ handoff, expanded = false, onToggle }: HandoffCardProps) {
  return (
    <Card
      variant="bordered"
      padding="none"
      className="hover:border-gold-500/30 transition-colors"
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
            <span className="font-semibold text-text-primary">{handoff.unicorn}</span>
            <Badge variant="gold" size="sm">handoff</Badge>
          </div>
          <div className="text-sm text-text-secondary">{handoff.focus}</div>
        </div>

        {/* Timestamp */}
        <div className="flex-shrink-0 text-right">
          <div className="text-xs text-text-tertiary">
            {formatRelativeTime(handoff.timestamp)}
          </div>
          <div className="text-xs text-text-tertiary mt-0.5">
            {formatDateTime(handoff.timestamp)}
          </div>
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-space-500 p-4 space-y-4">
          {/* Summary */}
          {handoff.summary && (
            <div>
              <div className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-1">
                Summary
              </div>
              <div className="text-sm text-text-secondary whitespace-pre-wrap">
                {handoff.summary}
              </div>
            </div>
          )}

          {/* Next Steps */}
          {handoff.next_steps && (
            <div>
              <div className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-1">
                Next Steps
              </div>
              <div className="text-sm text-text-secondary whitespace-pre-wrap">
                {handoff.next_steps}
              </div>
            </div>
          )}

          {/* Notes */}
          {handoff.notes && (
            <div>
              <div className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-1">
                Notes
              </div>
              <div className="text-sm text-text-secondary whitespace-pre-wrap">
                {handoff.notes}
              </div>
            </div>
          )}

          {/* Empty state if no details */}
          {!handoff.summary && !handoff.next_steps && !handoff.notes && (
            <div className="text-sm text-text-tertiary italic">
              No additional details recorded.
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
