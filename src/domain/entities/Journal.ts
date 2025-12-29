/**
 * Journal entity
 * Personal reflections and thoughts from unicorns
 */
export interface Journal {
  id: number;
  unicorn: string;
  title: string | null;
  content: string;
  visibility: 'private' | 'family';
  timestamp: string;
}

/**
 * Journal with search result context
 */
export interface JournalSearchResult extends Journal {
  snippet: string;
  rank: number;
}

/**
 * Journal list response from API
 */
export interface JournalListResponse {
  journals: Journal[];
  count: number;
  limit: number;
  offset: number;
}

/**
 * Journal search response
 */
export interface JournalSearchResponse {
  query: string;
  results: JournalSearchResult[];
  count: number;
}

/**
 * Create journal request
 */
export interface CreateJournalRequest {
  unicorn: string;
  content: string;
  title?: string;
  visibility?: 'private' | 'family';
}
