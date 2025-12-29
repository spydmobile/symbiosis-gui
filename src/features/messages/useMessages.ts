import { useCallback, useEffect, useState } from 'react';
import { gatewayApi } from '../../data/api';
import type { Message, MessageThread } from '../../domain/entities';

interface UseMessagesResult {
  messages: Message[];
  threads: MessageThread[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  stats: {
    total: number;
    unread: number;
  };
}

/**
 * Hook for fetching and managing messages with threading
 */
export function useMessages(): UseMessagesResult {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const result = await gatewayApi.getAllMessages(200);
      setMessages(result.messages);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Group messages into threads
  const threads = groupIntoThreads(messages);

  // Calculate stats
  const stats = {
    total: messages.length,
    unread: messages.filter(m => !m.read).length,
  };

  return {
    messages,
    threads,
    loading,
    error,
    refetch: fetchMessages,
    stats,
  };
}

/**
 * Group messages into conversation threads based on subject
 */
function groupIntoThreads(messages: Message[]): MessageThread[] {
  const threadMap = new Map<string, Message[]>();

  // Normalize subject for grouping (remove RE: prefix)
  const normalizeSubject = (subject: string): string => {
    return subject.replace(/^RE:\s*/i, '').trim();
  };

  // Group by normalized subject
  for (const message of messages) {
    const key = normalizeSubject(message.subject);
    const existing = threadMap.get(key) || [];
    existing.push(message);
    threadMap.set(key, existing);
  }

  // Convert to thread objects
  const threads: MessageThread[] = [];

  for (const [subject, threadMessages] of threadMap) {
    // Sort messages in thread by timestamp (oldest first for reading order)
    const sorted = [...threadMessages].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Get unique participants
    const participants = new Set<string>();
    for (const msg of sorted) {
      participants.add(msg.from_entity);
      participants.add(msg.to_entity);
    }

    // Find last activity
    const lastMessage = sorted[sorted.length - 1];

    threads.push({
      id: subject.toLowerCase().replace(/\s+/g, '-'),
      subject,
      participants: Array.from(participants),
      messages: sorted,
      lastActivity: lastMessage.timestamp,
      unreadCount: sorted.filter(m => !m.read).length,
    });
  }

  // Sort threads by last activity (most recent first)
  threads.sort(
    (a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
  );

  return threads;
}
