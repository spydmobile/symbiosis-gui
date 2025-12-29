import type { Message } from '../../domain/entities';
import { Badge } from '../../shared/components';
import { formatRelativeTime } from '../../shared/utils';

interface MessageCardProps {
  message: Message;
  onMarkRead?: (id: number) => void;
  compact?: boolean;
}

/**
 * Individual message display card
 */
export function MessageCard({ message, onMarkRead, compact = false }: MessageCardProps) {
  const isUnread = !message.read;

  return (
    <div
      className={`
        p-4 rounded-lg transition-colors
        ${isUnread ? 'bg-space-700 border-l-2 border-cyan-500' : 'bg-space-700/50'}
        ${compact ? 'p-3' : 'p-4'}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Sender */}
          <span className={`font-medium truncate ${isUnread ? 'text-text-primary' : 'text-text-secondary'}`}>
            {message.from_entity}
          </span>
          <span className="text-text-tertiary">→</span>
          <span className="text-text-secondary truncate">
            {message.to_entity}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Delivery badge */}
          {message.delivered_via.includes('email') && (
            <Badge variant="gold" size="sm">email</Badge>
          )}
          {isUnread && (
            <Badge variant="cyan" size="sm">new</Badge>
          )}
          {/* Timestamp */}
          <span className="text-xs text-text-tertiary">
            {formatRelativeTime(message.timestamp)}
          </span>
        </div>
      </div>

      {/* Subject (if not compact) */}
      {!compact && (
        <div className={`text-sm mb-2 ${isUnread ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
          {message.subject}
        </div>
      )}

      {/* Body */}
      <div className="text-sm text-text-secondary whitespace-pre-wrap">
        {message.body}
      </div>

      {/* Actions */}
      {isUnread && onMarkRead && (
        <div className="mt-3 pt-3 border-t border-space-500">
          <button
            onClick={() => onMarkRead(message.id)}
            className="text-xs text-cyan-400 hover:text-cyan-300"
          >
            Mark as read
          </button>
        </div>
      )}
    </div>
  );
}
