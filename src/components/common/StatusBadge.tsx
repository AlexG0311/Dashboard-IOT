import { cn } from '@/lib/utils';
import { STATUS_CONFIG } from '@/constants/sensorConfig';
import { NodeStatus } from '@/types/sensors';

interface StatusBadgeProps {
  status: NodeStatus;
  pulse?: boolean;
  className?: string;
}

/**
 * Shows a colored dot + label for a node's connection status.
 */
export function StatusBadge({ status, pulse = true, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.bgClass,
        config.textClass,
        className
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          config.dotClass,
          pulse && status === 'online' && 'animate-pulse'
        )}
      />
      {config.label}
    </span>
  );
}
