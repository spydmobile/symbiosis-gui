/**
 * Unified search types
 * For the "Google for Symbiosis" search feature
 */

import type { Message } from './Message';
import type { Handoff } from './Session';
import type { JournalSearchResult } from './Journal';
import type { SmekbSearchResult } from './Smekb';

/**
 * Unified search request
 */
export interface UnifiedSearchRequest {
  query: string;
  type?: 'messages' | 'handoffs' | 'journals' | 'smekb' | 'all';
  limit?: number;
  from?: string;  // filter messages by sender
  to?: string;    // filter messages by recipient
  domain?: string; // filter SMEKB by domain
  last?: '7d' | '30d' | '90d' | '1y';
  admin?: boolean; // bypass access control for admin GUI
}

/**
 * Unified search response
 */
export interface UnifiedSearchResponse {
  query: string;
  results: {
    messages?: {
      items: Message[];
      count: number;
    };
    handoffs?: {
      items: Handoff[];
      count: number;
    };
    journals?: {
      items: JournalSearchResult[];
      count: number;
    };
    smekb?: {
      items: SmekbSearchResult[];
      count: number;
    };
  };
  total_count: number;
}

/**
 * Search result type for displaying
 */
export type SearchResultType = 'message' | 'handoff' | 'journal' | 'smekb';

/**
 * Generic search result for unified display
 */
export interface SearchResult {
  type: SearchResultType;
  id: number;
  title: string;
  preview: string;
  timestamp: string;
  author?: string;
  metadata?: Record<string, unknown>;
}
