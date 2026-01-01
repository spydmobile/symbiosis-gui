// Domain entities - the core business types

export * from './Message';
export * from './Session';
export * from './Journal';
export * from './Smekb';
export * from './Search';
export * from './Admin';

/**
 * Gateway status response
 */
export interface GatewayStatus {
  status: string;
  service: string;
  stats: {
    total: number;
    unread: number;
    today: number;
  };
  hotDb: {
    messagesCount: number;
    oldestMessage: string;
    newestMessage: string;
  };
  archives?: {
    count: number;
    months: Array<{
      month: string;
      file: string;
      size: number;
    }>;
  };
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
