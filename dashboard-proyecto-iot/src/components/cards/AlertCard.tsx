import { AlertTriangle, Info, XCircle, BellOff } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { SensorAlert, AlertSeverity } from '@/types/sensors';
import { NODE_CONFIG } from '@/constants/sensorConfig';

interface AlertCardProps {
  alerts: SensorAlert[];
  className?: string;
}

const SEVERITY_ICON: Record<AlertSeverity, React.ElementType> = {
  info: Info,
  warning: AlertTriangle,
  critical: XCircle,
};

const SEVERITY_COLOR: Record<AlertSeverity, string> = {
  info: 'text-blue-400',
  warning: 'text-amber-400',
  critical: 'text-red-400',
};

const SEVERITY_BG: Record<AlertSeverity, string> = {
  info: 'bg-blue-400/10',
  warning: 'bg-amber-400/10',
  critical: 'bg-red-400/10',
};

/**
 * Card listing recent threshold alerts from all nodes.
 */
export function AlertCard({ alerts, className }: AlertCardProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-4', className)}>
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle size={14} className="text-amber-400" />
        <h3 className="text-sm font-semibold">Alertas</h3>
        {alerts.length > 0 && (
          <span className="ml-auto rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
            {alerts.length}
          </span>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
          <BellOff size={20} />
          <p className="text-xs">Sin alertas activas</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {alerts.map((alert) => {
            const Icon = SEVERITY_ICON[alert.severity];
            const nodeColor = NODE_CONFIG[alert.nodeId].color;
            return (
              <div
                key={alert.id}
                className={cn(
                  'flex items-start gap-2 rounded-lg p-2 text-xs',
                  SEVERITY_BG[alert.severity]
                )}
              >
                <Icon size={12} className={cn('mt-0.5 shrink-0', SEVERITY_COLOR[alert.severity])} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-medium" style={{ color: nodeColor }}>
                      {NODE_CONFIG[alert.nodeId].label}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{alert.sensor}</span>
                  </div>
                  <p className="text-foreground/80 leading-tight">{alert.message}</p>
                  <p className="text-muted-foreground/60 mt-0.5">
                    {format(new Date(alert.timestamp), 'HH:mm:ss')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
