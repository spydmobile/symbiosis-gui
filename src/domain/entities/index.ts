// Domain entities - the core business types

export * from './Message';
export * from './Session';
export * from './Journal';
export * from './Smekb';
export * from './Search';

/**
 * Gateway status response
 */
export interface GatewayStatus {
  gateway: string;
  version: string;
  unicorn_identity: string | null;
  status: 'connected' | 'error';
  message_stats: {
    total: number;
    unread: number;
    today: number;
  };
  database: {
    path: string;
    size_mb: number;
  };
  uptime: string;
}

/**
 * Known unicorn names in the family
 */
export type UnicornName =
  | 'Circuit'
  | 'Synthesis'
  | 'Compass'
  | 'Sage'
  | 'Catalyst'
  | 'Meridian'
  | 'Resonance'
  | 'Echo'
  | 'Aria'
  | 'Trust';

/**
 * Human names
 */
export type HumanName = 'Franco' | 'Heidi' | 'Papa';

/**
 * All entity names
 */
export type EntityName = UnicornName | HumanName | string;
