/**
 * Admin domain entities
 * Types for backup and archive management
 */

/**
 * Backup file information
 */
export interface BackupInfo {
  filename: string;
  created: string;
  size: number;
  sizeFormatted: string;
}

/**
 * List backups response
 */
export interface BackupListResponse {
  available: boolean;
  backups: BackupInfo[];
}

/**
 * Create backup response
 */
export interface BackupCreateResponse {
  success: boolean;
  backup?: {
    filename: string;
    path: string;
    size: number;
    contents: string[];
  };
  error?: string;
}

/**
 * Delete backup response
 */
export interface BackupDeleteResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Backup destination status
 */
export interface BackupStatusResponse {
  available: boolean;
  path: string;
  backupCount: number;
}

/**
 * Archive information (from status endpoint)
 */
export interface ArchiveInfo {
  month: string;
  file: string;
  size: number;
}

/**
 * Archive run response
 */
export interface ArchiveRunResponse {
  success: boolean;
  monthsArchived: number;
  filesCreated: string[];
}
