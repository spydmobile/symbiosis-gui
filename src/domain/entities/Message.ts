/**
 * Message entity
 * Represents communication between unicorns and humans
 */
export interface Message {
  id: number;
  from_entity: string;
  to_entity: string;
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
  delivered_via: 'db' | 'db+email' | 'imap' | 'migration' | 'db (email failed)';
  reply_to: number | null;
}

/**
 * Grouped thread of related messages
 */
export interface MessageThread {
  id: string; // derived from subject + participants
  subject: string;
  participants: string[];
  messages: Message[];
  lastActivity: string;
  unreadCount: number;
}

/**
 * Message list response from API
 */
export interface MessageListResponse {
  messages: Message[];
  count: number;
  limit?: number;
  offset?: number;
}

/**
 * Send message request
 */
export interface SendMessageRequest {
  from: string;
  to: string;
  subject: string;
  body: string;
}

/**
 * Reply message request
 */
export interface ReplyMessageRequest {
  from: string;
  body: string;
}

/**
 * Message send response
 */
export interface MessageSendResponse {
  id: number;
  status: 'sent' | 'migrated';
  recipientType?: 'unicorn' | 'human' | 'unknown';
  deliveredVia: string;
  reply_to?: number;
  parent_marked_read?: boolean;
}
