import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Sprout } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChartPoint {
  time: string;
  [key: string]: number | string;
}

interface SoilMoistureChartProps {
  data: ChartPoint[];
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: Record<string, unknown>) => {
  if (!active || !Array.isArray(payload) || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-border bg-card/95 p-2.5 text-xs shadow-xl backdrop-blur">
      <p className="mb-1.5 font-medium text-muted-foreground">{String(label)}</p>
      {(payload as Array<{ name: string; value: number; color: string }>).map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium">{Number(entry.value).toFixed(1)} %</span>
        </div>
      ))}
    </div>
  );
};

/**
 * Area chart showing volumetric soil moisture (Capacitive Soil Sensor v2.0).
 */
export function SoilMoistureChart({ data, className }: SoilMoistureChartProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-4', className)}>
      <div className="mb-4 flex items-center gap-2">
        <Sprout size={14} className="text-green-400" />
        <h3 className="text-sm font-semibold">Humedad del Suelo</h3>
        <span className="text-xs text-muted-foreground">— Cap. Soil Sensor v2.0</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="soilGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(215 20% 45%)' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10, fill: 'hsl(215 20% 45%)' }} tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} iconType="circle" iconSize={6} />
          <Area type="monotone" dataKey="Hum. Suelo" stroke="#22c55e" strokeWidth={1.5} fill="url(#soilGradient)" dot={false} activeDot={{ r: 3, strokeWidth: 0 }} connectNulls />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
