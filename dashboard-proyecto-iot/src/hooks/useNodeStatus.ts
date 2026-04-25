import { useMemo } from 'react';
import { NodeData, NodeStatus } from '@/types/sensors';

interface UseNodeStatusReturn {
  status: NodeStatus;
  timeSinceLastSeen: string;
  isStale: boolean;
}

const STALE_THRESHOLD_MS = 30_000;
const OFFLINE_THRESHOLD_MS = 120_000;

/**
 * Derives the online/offline/warning status of the node
 * based on the age of its last data timestamp.
 */
export function useNodeStatus(nodeData: NodeData | null): UseNodeStatusReturn {
  return useMemo(() => {
    if (!nodeData) {
      return { status: 'offline', timeSinceLastSeen: 'Sin datos', isStale: true };
    }

    const ageMs = Date.now() - new Date(nodeData.timestamp).getTime();
    let status: NodeStatus = 'online';
    if (ageMs > OFFLINE_THRESHOLD_MS) status = 'offline';
    else if (ageMs > STALE_THRESHOLD_MS) status = 'warning';

    return { status, timeSinceLastSeen: formatAge(ageMs), isStale: ageMs > STALE_THRESHOLD_MS };
  }, [nodeData]);
}

function formatAge(ageMs: number): string {
  const secs = Math.floor(ageMs / 1000);
  if (secs < 60) return `hace ${secs}s`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `hace ${mins}m`;
  return `hace ${Math.floor(mins / 60)}h`;
}
