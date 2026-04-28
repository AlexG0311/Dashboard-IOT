import { NodeId } from '@/types/sensors';

// ─── Sensor Thresholds ──────────────────────────────────────────────────────

export const THRESHOLDS = {
  airTemperature: { min: 10, max: 40, unit: '°C' },
  airHumidity: { min: 20, max: 90, unit: '%' },
  soilTemperature: { min: 5, max: 35, unit: '°C' },
  soilMoisture: { min: 20, max: 80, unit: '%' },
} as const;

// ─── Sensor Display Config ──────────────────────────────────────────────────

export const SENSOR_CONFIG = {
  airTemperature: {
    label: 'Temp. Aire',
    shortLabel: 'Temp. Aire',
    unit: '°C',
    sensor: 'DHT22',
    color: '#f97316',
    colorMuted: 'rgba(249, 115, 22, 0.15)',
    description: 'Temperatura del ambiente',
  },
  soilTemperature: {
    label: 'Temp. Suelo',
    shortLabel: 'Temp. Suelo',
    unit: '°C',
    sensor: 'DS18B20',
    color: '#ef4444',
    colorMuted: 'rgba(239, 68, 68, 0.15)',
    description: 'Temperatura del suelo (precisión)',
  },
  airHumidity: {
    label: 'Hum. Aire',
    shortLabel: 'Hum. Aire',
    unit: '%',
    sensor: 'DHT22',
    color: '#3b82f6',
    colorMuted: 'rgba(59, 130, 246, 0.15)',
    description: 'Humedad relativa del ambiente',
  },
  soilMoisture: {
    label: 'Hum. Suelo',
    shortLabel: 'Hum. Suelo',
    unit: '%',
    sensor: 'Cap. Soil v2.0',
    color: '#22c55e',
    colorMuted: 'rgba(34, 197, 94, 0.15)',
    description: 'Humedad volumétrica del suelo',
  },
} as const;

// ─── Node Config ─────────────────────────────────────────────────────────────

export const NODE_CONFIG: Record<NodeId, {
  label: string;
  color: string;
  colorMuted: string;
  glowClass: string;
}> = {
  mota1: {
    label: 'Mota 1',
    color: '#a855f7',
    colorMuted: 'rgba(168, 85, 247, 0.15)',
    glowClass: 'glow-purple',
  },
};

// ─── Status Config ─────────────────────────────────────────────────────────

export const STATUS_CONFIG = {
  online: {
    label: 'En línea',
    color: '#22c55e',
    bgClass: 'bg-green-500/10',
    textClass: 'text-green-400',
    dotClass: 'bg-green-400',
  },
  offline: {
    label: 'Sin conexión',
    color: '#6b7280',
    bgClass: 'bg-gray-500/10',
    textClass: 'text-gray-400',
    dotClass: 'bg-gray-400',
  },
  warning: {
    label: 'Advertencia',
    color: '#f59e0b',
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-400',
    dotClass: 'bg-amber-400',
  },
} as const;

// ─── WebSocket Config ─────────────────────────────────────────────────────

export const WS_CONFIG = {
  url: import.meta.env.VITE_WS_URL ?? 'ws://localhost:8080/ws',
  reconnectDelay: 3000,
  maxReconnectAttempts: 10,
  pingInterval: 30000,
} as const;

// ─── Chart Config ────────────────────────────────────────────────────────

export const CHART_CONFIG = {
  maxHistoryPoints: 30,
  animationDuration: 300,
} as const;
