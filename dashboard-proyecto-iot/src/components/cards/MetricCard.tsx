import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SensorIcon } from '@/components/common/SensorIcon';

type SensorType = 'airTemp' | 'soilTemp' | 'airHumidity' | 'soilMoisture';
type Trend = 'up' | 'down' | 'stable';

interface MetricCardProps {
  label: string;
  value: number | null;
  unit: string;
  sensorType: SensorType;
  sensorName: string;
  trend?: Trend;
  accentColor: string;
  accentColorMuted: string;
  className?: string;
}

/**
 * Displays a single sensor metric with value, unit, trend indicator,
 * and a sensor type label.
 */
export function MetricCard({
  label,
  value,
  unit,
  sensorType,
  sensorName,
  trend = 'stable',
  accentColor,
  accentColorMuted,
  className,
}: MetricCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor =
    trend === 'up' ? 'text-red-400' :
    trend === 'down' ? 'text-blue-400' :
    'text-muted-foreground';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-opacity-60',
        className
      )}
      style={{
        borderColor: `${accentColor}20`,
        boxShadow: `0 0 0 1px ${accentColor}10, inset 0 1px 0 0 ${accentColor}08`,
      }}
    >
      {/* Subtle gradient glow top-right */}
      <div
        className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full blur-2xl"
        style={{ background: accentColorMuted }}
      />

      <div className="relative">
        {/* Header row */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: accentColorMuted }}
            >
              <SensorIcon type={sensorType} size={14} />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground/80">{label}</p>
              <p className="text-[10px] text-muted-foreground">{sensorName}</p>
            </div>
          </div>
          <TrendIcon size={14} className={trendColor} />
        </div>

        {/* Value */}
        <div className="flex items-end gap-1">
          <span
            className="text-3xl font-light tabular-nums tracking-tight"
            style={{ color: accentColor }}
          >
            {value !== null ? value.toFixed(1) : '—'}
          </span>
          <span className="mb-1 text-sm text-muted-foreground">{unit}</span>
        </div>
      </div>
    </div>
  );
}
