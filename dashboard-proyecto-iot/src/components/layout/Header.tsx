import { format } from 'date-fns';
import { Activity } from 'lucide-react';
import { ConnectionIndicator } from '@/components/common/ConnectionIndicator';
import { StatusBadge } from '@/components/common/StatusBadge';
import { NodeStatus } from '@/types/sensors';

interface HeaderProps {
  nodeStatus: NodeStatus;
  isConnected: boolean;
  lastUpdated: Date | null;
  reconnect: () => void;
}

const isMockMode = !import.meta.env.VITE_WS_URL;

/**
 * Dashboard top header with title, node status badge, and connection info.
 */
export function Header({ nodeStatus, isConnected, lastUpdated, reconnect }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-6">
        {/* Logo / Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20">
            <Activity size={14} className="text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight">IoT Dashboard</h1>
            <p className="text-[10px] text-muted-foreground leading-none">
              Monitoreo de sensores agrícolas
            </p>
          </div>
        </div>

        {/* Status + connection */}
        <div className="flex items-center gap-4">
          {/* Node status badge */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            <span className="text-xs text-muted-foreground">Mota 1</span>
            <StatusBadge status={nodeStatus} />
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* Last updated */}
          {lastUpdated && (
            <span className="hidden md:block text-[10px] text-muted-foreground">
              Última lectura: {format(lastUpdated, 'HH:mm:ss')}
            </span>
          )}

          {/* Connection indicator */}
          <ConnectionIndicator
            isConnected={isConnected}
            isMockMode={isMockMode}
            onReconnect={reconnect}
          />
        </div>
      </div>
    </header>
  );
}
