/**
 * Gateway API Client
 * Implements IGatewayApi interface using axios
 */

import axios, { type AxiosInstance } from 'axios';
import type { IGatewayApi } from '../../domain/interfaces';
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
} from '../../domain/entities';

// Use VITE_API_URL env var, fall back to production gateway
// For local dev: VITE_API_URL=http://localhost:9999
const DEFAULT_BASE_URL = import.meta.env.VITE_API_URL || 'http://francom1.local:3032';

export class GatewayClient implements IGatewayApi {
  private client: AxiosInstance;

  constructor(baseUrl: string = DEFAULT_BASE_URL) {
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Status
  async getStatus(): Promise<GatewayStatus> {
    const { data } = await this.client.get('/status');
    return data;
  }

  // Messages
  async getAllMessages(limit = 100, offset = 0): Promise<MessageListResponse> {
    const { data } = await this.client.get('/messages/all', {
      params: { limit, offset },
    });
    return data;
  }

  async getInbox(unicorn: string, unreadOnly = false): Promise<MessageListResponse> {
    const { data } = await this.client.get(`/messages/${encodeURIComponent(unicorn)}`, {
      params: unreadOnly ? { unread: 'true' } : {},
    });
    return data;
  }

  async getSentMessages(
    unicorn: string,
    options: { to?: string; unreadOnly?: boolean; limit?: number } = {}
  ): Promise<MessageListResponse> {
    const params: Record<string, string | number> = {};
    if (options.to) params.to = options.to;
    if (options.unreadOnly) params.unread = 'true';
    if (options.limit) params.limit = options.limit;

    const { data } = await this.client.get(`/messages/sent/${encodeURIComponent(unicorn)}`, { params });
    return data;
  }

  async sendMessage(request: SendMessageRequest): Promise<MessageSendResponse> {
    const { data } = await this.client.post('/messages', request);
    return data;
  }

  async replyToMessage(messageId: number, request: ReplyMessageRequest): Promise<MessageSendResponse> {
    const { data } = await this.client.post(`/messages/${messageId}/reply`, request);
    return data;
  }

  async markAsRead(messageId: number): Promise<{ id: number; read: boolean }> {
    const { data } = await this.client.patch(`/messages/${messageId}/read`);
    return data;
  }

  async updateMessage(
    messageId: number,
    updates: Partial<Pick<Message, 'from_entity' | 'to_entity' | 'subject' | 'body'>>
  ): Promise<Message> {
    const { data } = await this.client.patch(`/messages/${messageId}`, updates);
    return data;
  }

  // Sessions/Presence
  async getPresence(): Promise<PresenceResponse> {
    const { data } = await this.client.get('/sessions/active');
    return data;
  }

  async startSession(unicorn: string): Promise<SessionStartResponse> {
    const { data } = await this.client.post('/sessions/start', { unicorn });
    return data;
  }

  async endSession(request: SessionEndRequest): Promise<{ status: string; handoff_id: number }> {
    const { data } = await this.client.post('/sessions/end', request);
    return data;
  }

  async setFocus(request: SetFocusRequest): Promise<{ status: string; unicorn: string; focus: string }> {
    const { data } = await this.client.patch('/sessions/focus', request);
    return data;
  }

  async getSession(unicorn: string): Promise<{
    unicorn: string;
    status: string;
    focus: string | null;
    check_in: string | null;
    check_out: string | null;
    last_activity: string;
    last_activity_relative: string;
  }> {
    const { data } = await this.client.get(`/sessions/${encodeURIComponent(unicorn)}`);
    return data;
  }

  // Handoffs
  async getHandoffs(unicorn?: string, limit = 50): Promise<Handoff[]> {
    const params: Record<string, string | number> = { limit };
    if (unicorn) params.unicorn = unicorn;

    const { data } = await this.client.get('/sessions/handoffs', { params });
    return data.handoffs;
  }

  // Journals
  async getJournals(
    unicorn: string,
    options: { visibility?: 'private' | 'family' | 'all'; limit?: number; offset?: number } = {}
  ): Promise<JournalListResponse> {
    const params: Record<string, string | number> = { unicorn };
    if (options.visibility) params.visibility = options.visibility;
    if (options.limit) params.limit = options.limit;
    if (options.offset) params.offset = options.offset;

    const { data } = await this.client.get('/journals', { params });
    return data;
  }

  async getJournalsAdmin(
    options: { limit?: number; offset?: number } = {}
  ): Promise<JournalListResponse> {
    const params: Record<string, number> = {};
    if (options.limit) params.limit = options.limit;
    if (options.offset) params.offset = options.offset;

    const { data } = await this.client.get('/journals/admin', { params });
    return data;
  }

  async searchJournals(
    query: string,
    unicorn: string,
    options: { author?: string; visibility?: string; limit?: number } = {}
  ): Promise<JournalSearchResponse> {
    const params: Record<string, string | number> = { q: query, unicorn };
    if (options.author) params.author = options.author;
    if (options.visibility) params.visibility = options.visibility;
    if (options.limit) params.limit = options.limit;

    const { data } = await this.client.get('/journals/search', { params });
    return data;
  }

  async createJournal(request: CreateJournalRequest): Promise<Journal> {
    const { data } = await this.client.post('/journals', request);
    return data;
  }

  async getJournal(id: number, unicorn: string): Promise<Journal> {
    const { data } = await this.client.get(`/journals/${id}`, {
      params: { unicorn },
    });
    return data;
  }

  // SMEKB
  async getDomains(): Promise<SmekbDomainsResponse> {
    const { data } = await this.client.get('/smekb/domains');
    return data;
  }

  async getDomainEntries(domain: string): Promise<SmekbDomainResponse> {
    const { data } = await this.client.get(`/smekb/${encodeURIComponent(domain)}`);
    return data;
  }

  async getEntry(
    domain: string,
    topic: string,
    includeHistory = false
  ): Promise<SmekbEntry | SmekbEntryWithHistory> {
    const { data } = await this.client.get(
      `/smekb/${encodeURIComponent(domain)}/${encodeURIComponent(topic)}`,
      { params: includeHistory ? { history: 'true' } : {} }
    );
    return data;
  }

  async searchSmekb(query: string, domain?: string, limit = 20): Promise<SmekbSearchResponse> {
    const params: Record<string, string | number> = { q: query, limit };
    if (domain) params.domain = domain;

    const { data } = await this.client.get('/smekb-search', { params });
    return data;
  }

  async writeSmekb(request: SmekbWriteRequest): Promise<SmekbWriteResponse> {
    const { data } = await this.client.post('/smekb', request);
    return data;
  }

  async deleteSmekb(domain: string, topic: string, author: string): Promise<{ message: string }> {
    const { data } = await this.client.delete(
      `/smekb/${encodeURIComponent(domain)}/${encodeURIComponent(topic)}`,
      { params: { author } }
    );
    return data;
  }

  // Unified Search
  async search(request: UnifiedSearchRequest): Promise<UnifiedSearchResponse> {
    const { data } = await this.client.get('/search', {
      params: {
        q: request.query,
        type: request.type,
        limit: request.limit,
        from: request.from,
        to: request.to,
        domain: request.domain,
        last: request.last,
      },
    });
    return data;
  }
}

// Singleton instance for app-wide use
export const gatewayApi = new GatewayClient();

// Allow runtime configuration
export function configureGateway(baseUrl: string): GatewayClient {
  return new GatewayClient(baseUrl);
}
