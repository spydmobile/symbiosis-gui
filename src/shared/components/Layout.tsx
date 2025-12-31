import { type ReactNode, useState, useEffect, createContext, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { SearchInput } from './Input';

// Sidebar context for controlling visibility from anywhere
interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a Layout');
  }
  return context;
}

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
 *
 * Responsive behavior:
 * - Desktop (md+): Sidebar always visible
 * - Mobile (<md): Sidebar hidden, opens as drawer with hamburger menu
 */
export function Layout({ children, sidebar }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const sidebarContext: SidebarContextType = {
    isOpen: sidebarOpen,
    toggle: () => setSidebarOpen((prev) => !prev),
    close: () => setSidebarOpen(false),
  };

  return (
    <SidebarContext.Provider value={sidebarContext}>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} showMenuButton={!!sidebar} />

        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Sidebar - always visible on md+ */}
          {sidebar && (
            <aside className="hidden md:block w-64 flex-shrink-0 border-r border-space-500 overflow-y-auto bg-space-900">
              {sidebar}
            </aside>
          )}

          {/* Mobile Sidebar Drawer */}
          {sidebar && sidebarOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              {/* Drawer */}
              <aside className="fixed inset-y-0 left-0 z-50 w-72 border-r border-space-500 overflow-y-auto bg-space-900 md:hidden animate-fade-in">
                {/* Close button */}
                <div className="flex justify-end p-2">
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 text-text-secondary hover:text-text-primary rounded-md"
                    aria-label="Close menu"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {sidebar}
              </aside>
            </>
          )}

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-space-900/95">
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}

interface HeaderProps {
  onMenuClick: () => void;
  showMenuButton: boolean;
}

function Header({ onMenuClick, showMenuButton }: HeaderProps) {
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
    <header className="h-14 md:h-16 border-b border-space-500 bg-space-800 flex items-center px-3 md:px-4 gap-2 md:gap-4">
      {/* Mobile menu button */}
      {showMenuButton && (
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-1 text-text-secondary hover:text-text-primary rounded-md"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Logo - clickable to go to dashboard */}
      <Link to="/" className="flex items-center gap-2 md:gap-3 flex-shrink-0 hover:opacity-80 transition-opacity">
        <img
          src="/images/logoV1.jpg"
          alt="Symbiosis Admin"
          className="h-10 w-10 md:h-14 md:w-14 rounded-lg object-cover shadow-glow-gold"
        />
        <span className="text-lg md:text-xl font-semibold text-text-primary hidden sm:block">
          Symbiosis Admin
        </span>
      </Link>

      {/* Search bar - grows to fill space */}
      <div className="flex-1 max-w-2xl mx-auto">
        <SearchInput
          placeholder="Search..."
          className="w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onClear={() => setSearchQuery('')}
        />
      </div>

      {/* Status area */}
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        <StatusIndicator />
      </div>
    </header>
  );
}

function StatusIndicator() {
  const [connected, setConnected] = useState<boolean | null>(null);

  // Get gateway URL from env or default
  const gatewayUrl = import.meta.env.VITE_API_URL || 'http://francom1.local:3032';
  // Extract host:port for display
  const displayUrl = gatewayUrl.replace(/^https?:\/\//, '');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`${gatewayUrl}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        });
        setConnected(response.ok);
      } catch {
        setConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, [gatewayUrl]);

  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className="w-2 h-2 rounded-full"
        style={{
          backgroundColor: connected === null
            ? '#6b7280'
            : connected
              ? '#4bd4a8'
              : '#d44b4b',
          animation: connected ? 'pulse 2s infinite' : 'none'
        }}
      />
      <span className="hidden md:block" style={{ color: '#a0a0b0' }}>
        <span style={{ color: '#6a6a7a' }}>Gateway:</span>{' '}
        <span style={{ color: connected === false ? '#d44b4b' : undefined }}>
          {displayUrl}
        </span>
        {connected === false && <span style={{ color: '#d44b4b' }}> (disconnected)</span>}
      </span>
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
    <nav className="flex gap-1 border-b border-space-500 mb-4 md:mb-6 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            px-3 md:px-4 py-2 text-sm font-medium rounded-t-md transition-colors whitespace-nowrap flex-shrink-0
            ${activeTab === tab.id
              ? 'text-text-primary bg-space-700 border-b-2 border-cyan-500'
              : 'text-text-secondary hover:text-text-primary hover:bg-space-700/50'
            }
          `}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`
              ml-1.5 md:ml-2 px-1.5 md:px-2 py-0.5 text-xs rounded-full
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
