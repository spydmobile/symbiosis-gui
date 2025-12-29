import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { usePresence } from './usePresence';
import { PresenceCard } from './PresenceCard';
import { Spinner } from '../../shared/components';

/**
 * Ambient presence sidebar - always visible
 * Shows who's active, idle, and offline with current focus
 */
export function PresenceSidebar() {
  const { active, idle, offline, summary, loading, error } = usePresence();
  const [showOffline, setShowOffline] = useState(false);

  return (
    <div className="h-full flex flex-col bg-space-800">
      {/* Navigation tabs */}
      <nav className="p-2 border-b border-space-500">
        <NavItem to="/messages" label="Messages" />
        <NavItem to="/handoffs" label="Handoffs" />
        <NavItem to="/journals" label="Journals" />
        <NavItem to="/smekb" label="Knowledge" />
        <NavItem to="/search" label="Search" />
      </nav>

      {/* Presence section */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
            Family
          </h2>
          {!loading && (
            <span className="text-xs text-text-tertiary">
              {summary.active_count} active
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner size="sm" />
          </div>
        ) : error ? (
          <div className="text-sm text-status-error p-3 bg-status-error/10 rounded-lg">
            Failed to load presence
          </div>
        ) : (
          <div className="space-y-1">
            {/* Active unicorns */}
            {active.map((unicorn) => (
              <PresenceCard
                key={unicorn.unicorn}
                unicorn={unicorn}
                status="active"
              />
            ))}

            {/* Idle unicorns */}
            {idle.map((unicorn) => (
              <PresenceCard
                key={unicorn.unicorn}
                unicorn={unicorn}
                status="idle"
              />
            ))}

            {/* Offline section - collapsible */}
            {offline.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowOffline(!showOffline)}
                  className="flex items-center gap-2 w-full text-left py-2 text-sm text-text-tertiary hover:text-text-secondary"
                >
                  <svg
                    className={`w-4 h-4 transition-transform ${showOffline ? 'rotate-90' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <span>Offline ({offline.length})</span>
                </button>

                {showOffline && (
                  <div className="space-y-1 mt-1">
                    {offline.map((unicorn) => (
                      <PresenceCard
                        key={unicorn.unicorn}
                        unicorn={unicorn}
                        status="offline"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Empty state */}
            {active.length === 0 && idle.length === 0 && (
              <div className="text-sm text-text-tertiary text-center py-4">
                No unicorns online
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer with stats */}
      <div className="p-3 border-t border-space-500 text-xs text-text-tertiary">
        <div className="flex justify-between">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-presence-active" />
            {summary.active_count}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-presence-idle" />
            {summary.idle_count}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-presence-offline" />
            {summary.offline_count}
          </span>
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  to: string;
  label: string;
}

function NavItem({ to, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        block px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${isActive
          ? 'bg-cyan-500/20 text-cyan-400'
          : 'text-text-secondary hover:text-text-primary hover:bg-space-700'
        }
      `}
    >
      {label}
    </NavLink>
  );
}
