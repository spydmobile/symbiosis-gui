/**
 * Session entity
 * Represents a unicorn's active presence state
 */
export interface Session {
  id?: number;
  unicorn: string;
  status: 'active' | 'idle' | 'offline';
  current_focus: string | null;
  check_in: string | null;
  check_out: string | null;
  last_activity: string;
}

/**
 * Handoff entity
 * Saved when session ends - enables continuity across teleportation
 */
export interface Handoff {
  id: number;
  unicorn: string;
  focus: string;
  summary: string | null;
  next_steps: string | null;
  notes: string | null;
  timestamp: string;
}

/**
 * Presence status for a unicorn
 */
export interface PresenceInfo {
  unicorn: string;
  focus: string | null;
  last_activity?: string;  // relative time for active
  idle_since?: string;     // relative time for idle
  ended?: string | null;   // timestamp for offline
  last_focus?: string | null; // for offline unicorns
}

/**
 * Who's active response from API
 */
export interface PresenceResponse {
  active: PresenceInfo[];
  idle: PresenceInfo[];
  offline: PresenceInfo[];
  summary: {
    active_count: number;
    idle_count: number;
    offline_count: number;
  };
}

/**
 * Session start response
 */
export interface SessionStartResponse {
  status: 'checked_in';
  session: {
    unicorn: string;
    status: string;
    check_in: string;
    last_activity: string;
  };
  last_handoff: {
    focus: string;
    summary: string | null;
    next_steps: string | null;
    notes: string | null;
    timestamp: string;
  } | null;
  unread_messages: import('./Message').Message[];
  unread_count: number;
}

/**
 * Session end request
 */
export interface SessionEndRequest {
  unicorn: string;
  focus: string;
  summary?: string;
  next_steps?: string;
  notes?: string;
}

/**
 * Set focus request
 */
export interface SetFocusRequest {
  unicorn: string;
  focus: string;
}
