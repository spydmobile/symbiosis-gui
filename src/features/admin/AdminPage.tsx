import { useState } from 'react';
import { Card, Spinner, EmptyState } from '../../shared/components';
import { useAdmin } from './useAdmin';
import type { BackupInfo } from '../../domain/entities';

export function AdminPage() {
  const {
    status,
    backupStatus,
    backups,
    loading,
    error,
    refresh,
    createBackup,
    deleteBackup,
    downloadBackup,
    runArchive,
    operationLoading,
  } = useAdmin();

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleCreateBackup = async () => {
    const result = await createBackup();
    if (result.success) {
      showNotification('success', `Backup created: ${result.filename}`);
    } else {
      showNotification('error', result.error || 'Backup failed');
    }
  };

  const handleDeleteBackup = async (filename: string) => {
    if (!confirm(`Delete backup ${filename}?`)) return;
    const result = await deleteBackup(filename);
    if (result.success) {
      showNotification('success', `Deleted ${filename}`);
    } else {
      showNotification('error', result.error || 'Delete failed');
    }
  };

  const handleRunArchive = async () => {
    const result = await runArchive();
    if (result.success) {
      if (result.monthsArchived && result.monthsArchived > 0) {
        showNotification('success', `Archived ${result.monthsArchived} month(s)`);
      } else {
        showNotification('success', 'No messages need archiving');
      }
    } else {
      showNotification('error', result.error || 'Archive failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card variant="bordered">
        <EmptyState
          icon={<ErrorIcon />}
          title="Unable to load admin panel"
          description={error.message}
        />
      </Card>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text-primary">System Admin</h1>
          <p className="text-sm text-text-secondary">
            Archive management and backup system
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={operationLoading}
          className="self-start sm:self-auto px-4 py-2 bg-space-700 text-text-secondary hover:text-text-primary rounded-md transition-colors text-sm disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Archive Management */}
        <Card variant="bordered" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <ArchiveIcon />
              Archive Management
            </h2>
          </div>

          {/* Hot Database Stats */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-text-secondary mb-2">Hot Database</h3>
            <div className="bg-space-700/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-text-secondary">Messages:</span>
                <span className="text-text-primary font-mono">{status?.hotDb.messagesCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Oldest:</span>
                <span className="text-text-primary font-mono text-sm">
                  {status?.hotDb.oldestMessage || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Newest:</span>
                <span className="text-text-primary font-mono text-sm">
                  {status?.hotDb.newestMessage || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Cold Archives */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-text-secondary mb-2">
              Cold Archives ({status?.archives?.count || 0})
            </h3>
            {status?.archives && status.archives.months.length > 0 ? (
              <div className="bg-space-700/50 rounded-lg divide-y divide-border-subtle">
                {status.archives.months.map((archive) => (
                  <div key={archive.month} className="flex justify-between items-center p-3">
                    <span className="text-text-primary font-mono">{archive.month}</span>
                    <span className="text-text-secondary text-sm">
                      {formatBytes(archive.size)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-space-700/50 rounded-lg p-4 text-center text-text-tertiary">
                No archives yet
              </div>
            )}
          </div>

          {/* Archive Action */}
          <button
            onClick={handleRunArchive}
            disabled={operationLoading}
            className="w-full px-4 py-2 bg-gold-500/20 text-gold-400 border border-gold-500/30 hover:bg-gold-500/30 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {operationLoading ? <Spinner size="sm" /> : <ArchiveIcon />}
            Run Archive Now
          </button>
          <p className="text-xs text-text-tertiary mt-2 text-center">
            Archives messages older than 3 months to compressed files
          </p>
        </Card>

        {/* Backup Management */}
        <Card variant="bordered" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <BackupIcon />
              Backup System
            </h2>
            {backupStatus?.available ? (
              <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded">
                Storage Ready
              </span>
            ) : (
              <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">
                Storage Unavailable
              </span>
            )}
          </div>

          {/* Backup Status */}
          <div className="mb-6">
            <div className="bg-space-700/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-text-secondary">Destination:</span>
                <span className="text-text-primary font-mono text-xs truncate max-w-48">
                  {backupStatus?.path || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Backups:</span>
                <span className="text-text-primary font-mono">{backups.length}</span>
              </div>
            </div>
          </div>

          {/* Backup List */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-text-secondary mb-2">
              Existing Backups
            </h3>
            {backups.length > 0 ? (
              <div className="bg-space-700/50 rounded-lg divide-y divide-border-subtle max-h-64 overflow-y-auto">
                {backups.map((backup) => (
                  <BackupRow
                    key={backup.filename}
                    backup={backup}
                    onDownload={() => downloadBackup(backup.filename)}
                    onDelete={() => handleDeleteBackup(backup.filename)}
                    disabled={operationLoading}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-space-700/50 rounded-lg p-4 text-center text-text-tertiary">
                No backups yet
              </div>
            )}
          </div>

          {/* Create Backup */}
          <button
            onClick={handleCreateBackup}
            disabled={operationLoading || !backupStatus?.available}
            className="w-full px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {operationLoading ? <Spinner size="sm" /> : <BackupIcon />}
            Create Backup Now
          </button>
          <p className="text-xs text-text-tertiary mt-2 text-center">
            Creates a zip file with hot DB and all archives
          </p>
        </Card>
      </div>
    </div>
  );
}

// Backup row component
interface BackupRowProps {
  backup: BackupInfo;
  onDownload: () => void;
  onDelete: () => void;
  disabled: boolean;
}

function BackupRow({ backup, onDownload, onDelete, disabled }: BackupRowProps) {
  // Parse date from filename or use created
  const displayDate = backup.created
    ? new Date(backup.created).toLocaleString()
    : backup.filename.slice(0, 16).replace('_', ' ');

  return (
    <div className="flex items-center justify-between p-3 group">
      <div className="flex-1 min-w-0">
        <p className="text-text-primary font-mono text-sm truncate">{backup.filename}</p>
        <p className="text-text-tertiary text-xs">{displayDate}</p>
      </div>
      <div className="flex items-center gap-2 ml-2">
        <span className="text-text-secondary text-sm whitespace-nowrap">
          {backup.sizeFormatted}
        </span>
        <button
          onClick={onDownload}
          disabled={disabled}
          className="p-1 text-text-tertiary hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
          title="Download backup"
        >
          <DownloadIcon />
        </button>
        <button
          onClick={onDelete}
          disabled={disabled}
          className="p-1 text-text-tertiary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
          title="Delete backup"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

// Helper functions
function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

// Icons
function ErrorIcon() {
  return (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  );
}

function BackupIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}
