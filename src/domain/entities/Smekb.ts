/**
 * SMEKB entry (Shared Memory and Empirical Knowledge Base)
 * Versioned knowledge entries organized by domain and topic
 */
export interface SmekbEntry {
  id: number;
  domain: string;
  topic: string;
  content: string;
  author: string;
  version: number;
  supersedes: number | null;
  created: string;
  updated: string;
}

/**
 * SMEKB entry with version history
 */
export interface SmekbEntryWithHistory extends SmekbEntry {
  history: SmekbEntry[];
}

/**
 * SMEKB search result with snippet
 */
export interface SmekbSearchResult extends SmekbEntry {
  snippet: string;
  rank: number;
}

/**
 * Domain summary with counts
 */
export interface SmekbDomain {
  domain: string;
  entry_count: number;
  last_updated: string;
}

/**
 * Domains list response
 */
export interface SmekbDomainsResponse {
  domains: SmekbDomain[];
}

/**
 * Domain entries response
 */
export interface SmekbDomainResponse {
  domain: string;
  entries: SmekbEntry[];
  count: number;
}

/**
 * Search response
 */
export interface SmekbSearchResponse {
  query: string;
  domain: string;
  results: SmekbSearchResult[];
  count: number;
}

/**
 * Create/update SMEKB request
 */
export interface SmekbWriteRequest {
  domain: string;
  topic: string;
  content: string;
  author: string;
}

/**
 * Create response
 */
export interface SmekbWriteResponse {
  id: number;
  domain: string;
  topic: string;
  content: string;
  author: string;
  version: number;
  previous_version?: number;
  message: string;
}
