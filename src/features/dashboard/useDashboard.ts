import { useState, useEffect } from 'react';
import { gatewayApi } from '../../data/api';
import type { GatewayStatus, PresenceResponse } from '../../domain/entities';

interface DashboardData {
  status: GatewayStatus | null;
  presence: PresenceResponse | null;
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

export function useDashboard(): DashboardData {
  const [status, setStatus] = useState<GatewayStatus | null>(null);
  const [presence, setPresence] = useState<PresenceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statusData, presenceData] = await Promise.all([
        gatewayApi.getStatus(),
        gatewayApi.getPresence(),
      ]);
      setStatus(statusData);
      setPresence(presenceData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load dashboard'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { status, presence, loading, error, refresh: fetchData };
}
