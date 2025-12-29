import { type ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchInput } from './Input';

interface LayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

/**
 * Main application layout with header, sidebar, and content area
 *
 * Structure:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Header: Logo    [🔍 unified search...............]    Status    │
 * ├───────────────┬─────────────────────────────────────────────────┤
 * │               │                                                 │
 * │   SIDEBAR     │   Main Content Area                             │
 * │   (presence)  │                                                 │
 * │               │                                                 │
 * └───────────────┴─────────────────────────────────────────────────┘
 */
export function Layout({ children, sidebar }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebar && (
          <aside className="w-64 flex-shrink-0 border-r border-space-500 overflow-y-auto bg-space-900">
            {sidebar}
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 bg-space-900/95">
          {children}
        </main>
      </div>
    </div>
  );
}

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setSearchQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="h-16 border-b border-space-500 bg-space-800 flex items-center px-4 gap-4">
      {/* Logo */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <img
          src="/images/logoV1.jpg"
          alt="Symbiosis"
          className="h-14 w-14 rounded-lg object-cover shadow-glow-gold"
        />
        <span className="text-xl font-semibold text-text-primary hidden sm:block">
          Symbiosis
        </span>
      </div>

      {/* Search bar - grows to fill space */}
      <div className="flex-1 max-w-2xl mx-auto">
        <SearchInput
          placeholder="Search messages, handoffs, journals, knowledge..."
          className="w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onClear={() => setSearchQuery('')}
        />
      </div>

      {/* Status area */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <StatusIndicator />
      </div>
    </header>
  );
}

function StatusIndicator() {
  // TODO: Connect to actual gateway status
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
      <span className="text-text-secondary hidden md:block">Gateway Connected</span>
    </div>
  );
}

// Tab navigation component for content areas
interface TabsProps {
  tabs: { id: string; label: string; count?: number }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <nav className="flex gap-1 border-b border-space-500 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            px-4 py-2 text-sm font-medium rounded-t-md transition-colors
            ${activeTab === tab.id
              ? 'text-text-primary bg-space-700 border-b-2 border-cyan-500'
              : 'text-text-secondary hover:text-text-primary hover:bg-space-700/50'
            }
          `}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`
              ml-2 px-2 py-0.5 text-xs rounded-full
              ${activeTab === tab.id
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'bg-space-600 text-text-tertiary'
              }
            `}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}

// Empty state component
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && (
        <div className="mb-4 text-text-tertiary">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-text-primary mb-1">{title}</h3>
      {description && (
        <p className="text-text-secondary mb-4 max-w-sm">{description}</p>
      )}
      {action}
    </div>
  );
}

// Loading spinner
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <svg
      className={`animate-spin text-cyan-500 ${sizeClasses[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Page loading state
export function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px]">
      <Spinner size="lg" />
    </div>
  );
}
