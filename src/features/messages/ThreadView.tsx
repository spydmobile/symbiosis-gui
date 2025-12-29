import { useState } from 'react';
import type { MessageThread } from '../../domain/entities';
import { MessageCard } from './MessageCard';
import { Badge } from '../../shared/components';
import { formatRelativeTime } from '../../shared/utils';

interface ThreadViewProps {
  thread: MessageThread;
  onMarkRead?: (messageId: number) => void;
  defaultExpanded?: boolean;
}

/**
 * Expandable thread view showing a conversation
 */
export function ThreadView({ thread, onMarkRead, defaultExpanded = false }: ThreadViewProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasUnread = thread.unreadCount > 0;
  const messageCount = thread.messages.length;

  return (
    <div className={`
      rounded-lg border transition-colors
      ${hasUnread ? 'border-cyan-500/30 bg-space-700' : 'border-space-500 bg-space-700/50'}
    `}>
      {/* Thread header - clickable to expand */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 flex items-start gap-3"
      >
        {/* Expand/collapse indicator */}
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

        {/* Thread info */}
        <div className="flex-1 min-w-0">
          {/* Subject */}
          <div className={`font-medium truncate ${hasUnread ? 'text-text-primary' : 'text-text-secondary'}`}>
            {thread.subject}
          </div>

          {/* Participants */}
          <div className="text-sm text-text-tertiary mt-1">
            {thread.participants.join(', ')}
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {hasUnread && (
            <Badge variant="cyan" size="sm">
              {thread.unreadCount} new
            </Badge>
          )}
          <Badge variant="default" size="sm">
            {messageCount} {messageCount === 1 ? 'message' : 'messages'}
          </Badge>
          <span className="text-xs text-text-tertiary">
            {formatRelativeTime(thread.lastActivity)}
          </span>
        </div>
      </button>

      {/* Expanded messages */}
      {expanded && (
        <div className="border-t border-space-500 p-4 space-y-3">
          {thread.messages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              onMarkRead={onMarkRead}
              compact
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Thread list summary row (for compact list view)
 */
interface ThreadRowProps {
  thread: MessageThread;
  onClick: () => void;
  selected?: boolean;
}

export function ThreadRow({ thread, onClick, selected = false }: ThreadRowProps) {
  const hasUnread = thread.unreadCount > 0;
  const lastMessage = thread.messages[thread.messages.length - 1];

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-3 rounded-lg transition-colors
        ${selected ? 'bg-cyan-500/20 border border-cyan-500/30' : 'hover:bg-space-600'}
        ${hasUnread ? 'bg-space-700' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {/* Subject */}
          <div className={`truncate ${hasUnread ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
            {thread.subject}
          </div>
          {/* Preview of last message */}
          <div className="text-sm text-text-tertiary truncate mt-1">
            {lastMessage.from_entity}: {lastMessage.body.slice(0, 60)}...
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-xs text-text-tertiary">
            {formatRelativeTime(thread.lastActivity)}
          </span>
          {hasUnread && (
            <span className="w-5 h-5 rounded-full bg-cyan-500 text-space-900 text-xs font-medium flex items-center justify-center">
              {thread.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
