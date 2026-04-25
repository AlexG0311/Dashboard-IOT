// ─── Sensor Reading Types ───────────────────────────────────────────────────

export interface DHT22Data {
  airTemperature: number;   // °C
  airHumidity: number;      // %RH
}

export interface DS18B20Data {
  soilTemperature: number;  // °C
}

export interface SoilMoistureData {
  moisturePercent: number;  // 0–100%
  rawValue: number;         // ADC raw value (0–4095 for ESP32)
}

// ─── Node / Mota ───────────────────────────────────────────────────────────

export type NodeId = 'mota1';
export type NodeStatus = 'online' | 'offline' | 'warning';

export interface NodeData {
  nodeId: NodeId;
  timestamp: string;        // ISO 8601
  dht22: DHT22Data;
  ds18b20: DS18B20Data;
  soilMoisture: SoilMoistureData;
}

// ─── Historical Data ────────────────────────────────────────────────────────

export interface HistoricalPoint {
  timestamp: string;
  airTemp: number;
  soilTemp: number;
  airHumidity: number;
  soilMoisture: number;
}

// ─── Alerts ─────────────────────────────────────────────────────────────────

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface SensorAlert {
  id: string;
  nodeId: NodeId;
  sensor: string;
  message: string;
  severity: AlertSeverity;
  timestamp: string;
}

// ─── WebSocket Message ─────────────────────────────────────────────────────

export interface WSMessage {
  type: 'sensor_update' | 'node_status' | 'ping';
  payload: NodeData | { nodeId: NodeId; status: NodeStatus } | null;
}

// ─── Dashboard State ────────────────────────────────────────────────────────

export interface DashboardState {
  node: NodeData | null;
  history: HistoricalPoint[];
  alerts: SensorAlert[];
  nodeStatus: NodeStatus;
  isConnected: boolean;
  lastUpdated: string | null;
}
