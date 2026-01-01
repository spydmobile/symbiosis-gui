import { useState, useEffect, useCallback } from 'react';
import { gatewayApi } from '../../data/api';
import type {
  GatewayStatus,
  BackupInfo,
  BackupStatusResponse,
} from '../../domain/entities';

interface AdminData {
  // Status/Archive data
  status: GatewayStatus | null;
  // Backup data
  backupStatus: BackupStatusResponse | null;
  backups: BackupInfo[];
  // State
  loading: boolean;
  error: Error | null;
  // Actions
  refresh: () => Promise<void>;
  createBackup: () => Promise<{ success: boolean; filename?: string; error?: string }>;
  deleteBackup: (filename: string) => Promise<{ success: boolean; error?: string }>;
  downloadBackup: (filename: string) => void;
  runArchive: () => Promise<{ success: boolean; monthsArchived?: number; error?: string }>;
  // Operation state
  operationLoading: boolean;
}

export function useAdmin(): AdminData {
  const [status, setStatus] = useState<GatewayStatus | null>(null);
  const [backupStatus, setBackupStatus] = useState<BackupStatusResponse | null>(null);
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [operationLoading, setOperationLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statusData, backupStatusData, backupListData] = await Promise.all([
        gatewayApi.getStatus(),
        gatewayApi.getBackupStatus(),
        gatewayApi.listBackups(),
      ]);
      setStatus(statusData);
      setBackupStatus(backupStatusData);
      setBackups(backupListData.backups);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load admin data'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createBackup = useCallback(async () => {
    setOperationLoading(true);
    try {
      const result = await gatewayApi.createBackup();
      if (result.success) {
        // Refresh backup list
        const backupListData = await gatewayApi.listBackups();
        setBackups(backupListData.backups);
        return { success: true, filename: result.backup?.filename };
      }
      return { success: false, error: result.error };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    } finally {
      setOperationLoading(false);
    }
  }, []);

  const deleteBackup = useCallback(async (filename: string) => {
    setOperationLoading(true);
    try {
      const result = await gatewayApi.deleteBackup(filename);
      if (result.success) {
        // Refresh backup list
        const backupListData = await gatewayApi.listBackups();
        setBackups(backupListData.backups);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    } finally {
      setOperationLoading(false);
    }
  }, []);

  const runArchive = useCallback(async () => {
    setOperationLoading(true);
    try {
      const result = await gatewayApi.runArchive();
      if (result.success) {
        // Refresh status to get updated archive info
        const statusData = await gatewayApi.getStatus();
        setStatus(statusData);
        return { success: true, monthsArchived: result.monthsArchived };
      }
      return { success: false, error: 'Archive failed' };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    } finally {
      setOperationLoading(false);
    }
  }, []);

  const downloadBackup = useCallback((filename: string) => {
    const url = gatewayApi.getBackupDownloadUrl(filename);
    // Open download in new tab (browser will handle as file download)
    window.open(url, '_blank');
  }, []);

  return {
    status,
    backupStatus,
    backups,
    loading,
    error,
    refresh: fetchData,
    createBackup,
    deleteBackup,
    downloadBackup,
    runArchive,
    operationLoading,
  };
}
