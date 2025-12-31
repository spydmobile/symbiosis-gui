import { PresenceDot } from '../../shared/components';
import { formatRelativeTime } from '../../shared/utils';
import type { PresenceInfo } from '../../domain/entities';

type PresenceStatus = 'active' | 'idle' | 'offline';

interface PresenceCardProps {
  unicorn: PresenceInfo;
  status: PresenceStatus;
  onClick?: () => void;
}

/**
 * Individual unicorn presence card
 */
export function PresenceCard({ unicorn, status, onClick }: PresenceCardProps) {
  const focusText = getFocusText(unicorn, status);
  const timeText = getTimeText(unicorn, status);

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-3 rounded-lg transition-colors
        ${status === 'active'
          ? 'bg-space-700 hover:bg-space-600'
          : status === 'idle'
            ? 'bg-space-700/50 hover:bg-space-600/50'
            : 'bg-transparent hover:bg-space-700/30'
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* Presence indicator */}
        <div className="mt-1">
          <PresenceDot status={status} pulse={status === 'active'} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Unicorn name */}
          <div className={`
            font-medium
            ${status === 'offline' ? 'text-text-secondary' : 'text-text-primary'}
          `}>
            {unicorn.unicorn}
          </div>

          {/* Focus/status text - allow wrapping, no truncation */}
          {focusText && (
            <div className="text-sm text-text-primary/80 mt-1 break-words whitespace-normal">
              {focusText}
            </div>
          )}

          {/* Time text */}
          {timeText && (
            <div className="text-xs text-text-secondary mt-1">
              {timeText}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

function getFocusText(unicorn: PresenceInfo, status: PresenceStatus): string | null {
  if (status === 'active' || status === 'idle') {
    return unicorn.focus || null;
  }
  return unicorn.last_focus || null;
}

function getTimeText(unicorn: PresenceInfo, status: PresenceStatus): string | null {
  if (status === 'active') {
    return unicorn.last_activity || null;
  }
  if (status === 'idle') {
    return unicorn.idle_since ? `idle ${unicorn.idle_since}` : null;
  }
  if (status === 'offline' && unicorn.ended) {
    return `offline since ${formatRelativeTime(unicorn.ended)}`;
  }
  return null;
}
