import { format } from 'date-fns';
import { Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/common/StatusBadge';
import { NodeData, NodeId, NodeStatus } from '@/types/sensors';
import { NODE_CONFIG } from '@/constants/sensorConfig';

interface NodeStatusCardProps {
  nodeId: NodeId;
  nodeData: NodeData | null;
  status: NodeStatus;
  timeSinceLastSeen: string;
  className?: string;
}

/**
 * Summary card showing a node's identity, status, and last seen time.
 */
export function NodeStatusCard({
  nodeId,
  nodeData,
  status,
  timeSinceLastSeen,
  className,
}: NodeStatusCardProps) {
  const config = NODE_CONFIG[nodeId];

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border border-border bg-card p-4',
        className
      )}
      style={{ borderColor: `${config.color}20` }}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ background: config.colorMuted }}
      >
        <Server size={16} style={{ color: config.color }} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold" style={{ color: config.color }}>
            {config.label}
          </p>
          <StatusBadge status={status} />
        </div>
        <p className="text-[11px] text-muted-foreground truncate">
          {nodeData
            ? `Última lectura: ${format(new Date(nodeData.timestamp), 'HH:mm:ss')} · ${timeSinceLastSeen}`
            : 'Sin datos disponibles'}
        </p>
      </div>
    </div>
  );
}
