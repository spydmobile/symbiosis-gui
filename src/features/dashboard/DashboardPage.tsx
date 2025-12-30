import { Card, Spinner, EmptyState } from '../../shared/components';
import { useDashboard } from './useDashboard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export function DashboardPage() {
  const { status, presence, loading, error, refresh } = useDashboard();

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card variant="bordered">
        <EmptyState
          icon={
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
          title="Unable to load dashboard"
          description={error.message}
        />
      </Card>
    );
  }

  // Prepare data for charts
  const messageData = [
    { name: 'Total', value: status?.stats.total || 0, fill: '#4ba8d4' },
    { name: 'Today', value: status?.stats.today || 0, fill: '#d4a84b' },
    { name: 'Unread', value: status?.stats.unread || 0, fill: '#d44b4b' },
  ];

  const presenceData = [
    { name: 'Active', value: presence?.summary.active_count || 0, fill: '#4bd4a8' },
    { name: 'Idle', value: presence?.summary.idle_count || 0, fill: '#d4a84b' },
    { name: 'Offline', value: presence?.summary.offline_count || 0, fill: '#6b7280' },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-secondary">
            Family overview and system status
          </p>
        </div>
        <button
          onClick={refresh}
          className="self-start sm:self-auto px-4 py-2 bg-space-700 text-text-secondary hover:text-text-primary rounded-md transition-colors text-sm"
        >
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Messages"
          value={status?.stats.total || 0}
          icon={<MessageIcon />}
          color="cyan"
        />
        <StatCard
          label="Unread"
          value={status?.stats.unread || 0}
          icon={<InboxIcon />}
          color="red"
        />
        <StatCard
          label="Today"
          value={status?.stats.today || 0}
          icon={<CalendarIcon />}
          color="gold"
        />
        <StatCard
          label="Active Unicorns"
          value={presence?.summary.active_count || 0}
          icon={<UsersIcon />}
          color="green"
          subtitle={`${presence?.summary.idle_count || 0} idle, ${presence?.summary.offline_count || 0} offline`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Message Stats Bar Chart */}
        <Card variant="bordered" className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Message Statistics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={messageData} layout="vertical">
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="name" type="category" stroke="#6b7280" width={60} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a24',
                    border: '1px solid #2a2a34',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#f4f4f8' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Presence Pie Chart */}
        <Card variant="bordered" className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Family Presence</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={presenceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                >
                  {presenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a24',
                    border: '1px solid #2a2a34',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {presenceData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm text-text-secondary">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Active Unicorns List */}
      {presence && presence.active.length > 0 && (
        <Card variant="bordered" className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Currently Active</h3>
          <div className="space-y-3">
            {presence.active.map((unicorn) => (
              <div
                key={unicorn.unicorn}
                className="flex items-center gap-3 p-3 bg-space-700/50 rounded-lg"
              >
                <div className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                <span className="font-medium text-text-primary">{unicorn.unicorn}</span>
                {unicorn.focus && (
                  <span className="text-text-secondary text-sm">— {unicorn.focus}</span>
                )}
                <span className="ml-auto text-text-tertiary text-sm">
                  {unicorn.last_activity}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* System Info */}
      <div className="mt-8 text-sm text-text-tertiary">
        <p>
          Database: {status?.hotDb.messagesCount} messages
          {status?.hotDb.oldestMessage && ` (${status.hotDb.oldestMessage} → ${status.hotDb.newestMessage})`}
        </p>
        {status?.archives && status.archives.count > 0 && (
          <p>Archives: {status.archives.count} month(s)</p>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: 'cyan' | 'gold' | 'red' | 'green';
  subtitle?: string;
}

function StatCard({ label, value, icon, color, subtitle }: StatCardProps) {
  const colorClasses = {
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    gold: 'text-gold-400 bg-gold-500/10 border-gold-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    green: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  };

  return (
    <Card variant="bordered" className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-secondary text-sm">{label}</p>
          <p className="text-3xl font-bold text-text-primary mt-1">{value}</p>
          {subtitle && (
            <p className="text-text-tertiary text-xs mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-2 rounded-lg border ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

// Icons
function MessageIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}
