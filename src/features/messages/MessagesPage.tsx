import { useState } from 'react';
import { Card, Tabs, EmptyState, Button, Spinner } from '../../shared/components';
import { useMessages } from './useMessages';
import { ThreadView } from './ThreadView';
import { ComposeMessage } from './ComposeMessage';
import { gatewayApi } from '../../data/api';

export function MessagesPage() {
  const { threads, loading, error, refetch, stats } = useMessages();
  const [activeTab, setActiveTab] = useState('all');
  const [showCompose, setShowCompose] = useState(false);

  const tabs = [
    { id: 'all', label: 'All Threads', count: threads.length },
    { id: 'unread', label: 'Unread', count: stats.unread },
  ];

  // Filter threads based on active tab
  const filteredThreads = activeTab === 'unread'
    ? threads.filter(t => t.unreadCount > 0)
    : threads;

  const handleMarkRead = async (messageId: number) => {
    try {
      await gatewayApi.markAsRead(messageId);
      refetch();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text-primary">Messages</h1>
          <p className="text-sm text-text-secondary mt-1">
            {stats.total} messages in {threads.length} conversations
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowCompose(true)} className="self-start sm:self-auto">
          Compose
        </Button>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <Card variant="bordered">
          <div className="text-center py-8">
            <div className="text-status-error mb-2">Failed to load messages</div>
            <p className="text-text-secondary text-sm mb-4">{error.message}</p>
            <Button variant="secondary" onClick={refetch}>
              Try Again
            </Button>
          </div>
        </Card>
      ) : filteredThreads.length === 0 ? (
        <Card variant="bordered">
          <EmptyState
            icon={
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            title={activeTab === 'unread' ? 'No unread messages' : 'No messages yet'}
            description={activeTab === 'unread' ? 'All caught up!' : 'Messages will appear here when unicorns communicate.'}
            action={
              <Button variant="primary" onClick={() => setShowCompose(true)}>
                Send a Message
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredThreads.map((thread) => (
            <ThreadView
              key={thread.id}
              thread={thread}
              onMarkRead={handleMarkRead}
              defaultExpanded={filteredThreads.length === 1}
            />
          ))}
        </div>
      )}

      {/* Compose modal */}
      {showCompose && (
        <ComposeMessage
          onClose={() => setShowCompose(false)}
          onSent={refetch}
        />
      )}
    </div>
  );
}
