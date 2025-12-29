/**
 * Gateway API interface
 * Defines the contract for interacting with the Symbiosis Gateway
 */

import type {
  Message,
  MessageListResponse,
  SendMessageRequest,
  ReplyMessageRequest,
  MessageSendResponse,
  PresenceResponse,
  Handoff,
  SessionStartResponse,
  SessionEndRequest,
  SetFocusRequest,
  Journal,
  JournalListResponse,
  JournalSearchResponse,
  CreateJournalRequest,
  SmekbEntry,
  SmekbEntryWithHistory,
  SmekbDomainsResponse,
  SmekbDomainResponse,
  SmekbSearchResponse,
  SmekbWriteRequest,
  SmekbWriteResponse,
  UnifiedSearchRequest,
  UnifiedSearchResponse,
  GatewayStatus,
} from '../entities';

export interface IGatewayApi {
  // Status
  getStatus(): Promise<GatewayStatus>;

  // Messages
  getAllMessages(limit?: number, offset?: number): Promise<MessageListResponse>;
  getInbox(unicorn: string, unreadOnly?: boolean): Promise<MessageListResponse>;
  getSentMessages(unicorn: string, options?: { to?: string; unreadOnly?: boolean; limit?: number }): Promise<MessageListResponse>;
  sendMessage(request: SendMessageRequest): Promise<MessageSendResponse>;
  replyToMessage(messageId: number, request: ReplyMessageRequest): Promise<MessageSendResponse>;
  markAsRead(messageId: number): Promise<{ id: number; read: boolean }>;
  updateMessage(messageId: number, updates: Partial<Pick<Message, 'from_entity' | 'to_entity' | 'subject' | 'body'>>): Promise<Message>;

  // Sessions/Presence
  getPresence(): Promise<PresenceResponse>;
  startSession(unicorn: string): Promise<SessionStartResponse>;
  endSession(request: SessionEndRequest): Promise<{ status: string; handoff_id: number }>;
  setFocus(request: SetFocusRequest): Promise<{ status: string; unicorn: string; focus: string }>;
  getSession(unicorn: string): Promise<{
    unicorn: string;
    status: string;
    focus: string | null;
    check_in: string | null;
    check_out: string | null;
    last_activity: string;
    last_activity_relative: string;
  }>;

  // Handoffs (for browsing history)
  getHandoffs(unicorn?: string, limit?: number): Promise<Handoff[]>;

  // Journals
  getJournals(unicorn: string, options?: { visibility?: 'private' | 'family' | 'all'; limit?: number; offset?: number }): Promise<JournalListResponse>;
  searchJournals(query: string, unicorn: string, options?: { author?: string; visibility?: string; limit?: number }): Promise<JournalSearchResponse>;
  createJournal(request: CreateJournalRequest): Promise<Journal>;
  getJournal(id: number, unicorn: string): Promise<Journal>;

  // SMEKB
  getDomains(): Promise<SmekbDomainsResponse>;
  getDomainEntries(domain: string): Promise<SmekbDomainResponse>;
  getEntry(domain: string, topic: string, includeHistory?: boolean): Promise<SmekbEntry | SmekbEntryWithHistory>;
  searchSmekb(query: string, domain?: string, limit?: number): Promise<SmekbSearchResponse>;
  writeSmekb(request: SmekbWriteRequest): Promise<SmekbWriteResponse>;
  deleteSmekb(domain: string, topic: string, author: string): Promise<{ message: string }>;

  // Unified Search
  search(request: UnifiedSearchRequest): Promise<UnifiedSearchResponse>;
}
