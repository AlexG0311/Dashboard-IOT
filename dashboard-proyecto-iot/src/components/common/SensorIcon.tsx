import { Thermometer, Droplets, Sprout, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

type SensorType = 'airTemp' | 'soilTemp' | 'airHumidity' | 'soilMoisture';

interface SensorIconProps {
  type: SensorType;
  size?: number;
  className?: string;
}

const ICON_MAP: Record<SensorType, React.ElementType> = {
  airTemp: Thermometer,
  soilTemp: Thermometer,
  airHumidity: Wind,
  soilMoisture: Sprout,
};

const COLOR_MAP: Record<SensorType, string> = {
  airTemp: 'text-orange-400',
  soilTemp: 'text-red-400',
  airHumidity: 'text-blue-400',
  soilMoisture: 'text-green-400',
};

/**
 * Renders the appropriate icon for each sensor measurement type.
 */
export function SensorIcon({ type, size = 16, className }: SensorIconProps) {
  const Icon = ICON_MAP[type];
  return <Icon size={size} className={cn(COLOR_MAP[type], className)} />;
}

// Also export a small water drop for humidity display
export { Droplets };
