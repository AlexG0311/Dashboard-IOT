import { NodeData, NodeId, HistoricalPoint } from '@/types/sensors';
import { CHART_CONFIG } from '@/constants/sensorConfig';

const API_BASE = 'http://localhost:3000';

// ─── API Response Types ──────────────────────────────────────────────────────

interface SensorReading {
  estacion: string;
  humedad_ambiente: number;
  humedad_suelo: number | null;
  riego_activo: number;
  temperatura_ambiente: number;
  time: number;
}

// ─── Data Transformers ───────────────────────────────────────────────────────

/**
 * Transforms API sensor reading to NodeData format.
 */
function transformToNodeData(reading: SensorReading, nodeId: NodeId = 'mota1'): NodeData {
  // Raw ADC: 0% = ~3200, 100% = ~1200 (inverted capacitive sensor)
  const soilMoist = Math.max(0, Math.min(100, reading.humedad_suelo ?? 0));
  const rawValue = Math.round(3200 - (soilMoist / 100) * 2000);

  return {
    nodeId,
    timestamp: new Date(reading.time).toISOString(),
    dht22: {
      airTemperature: parseFloat(reading.temperatura_ambiente.toFixed(1)),
      airHumidity: parseFloat(reading.humedad_ambiente.toFixed(1)),
    },
    ds18b20: {
      soilTemperature: 0, // Not provided by API
    },
    soilMoisture: {
      moisturePercent: soilMoist,
      rawValue,
    },
  };
}

/**
 * Transforms API sensor reading to HistoricalPoint format.
 */
function transformToHistoricalPoint(reading: SensorReading): HistoricalPoint {
  return {
    timestamp: new Date(reading.time).toISOString(),
    airTemp: parseFloat(reading.temperatura_ambiente.toFixed(1)),
    soilTemp: 0, // Not provided by API
    airHumidity: parseFloat(reading.humedad_ambiente.toFixed(1)),
    soilMoisture: Math.max(0, Math.min(100, reading.humedad_suelo ?? 0)),
  };
}

// ─── Data Fetchers ──────────────────────────────────────────────────────────

/**
 * Fetch latest sensor reading from API.
 */
export async function fetchLatestReading(nodeId: NodeId = 'mota1'): Promise<NodeData> {
  try {
    const response = await fetch(`${API_BASE}/sensores`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    const readings: SensorReading[] = await response.json();
    
    // Get the most recent reading
    const latest = readings[readings.length - 1];
    if (!latest) {
      throw new Error('No sensor data available');
    }
    
    return transformToNodeData(latest, nodeId);
  } catch (error) {
    console.error('Failed to fetch latest reading:', error);
    throw error;
  }
}

/**
 * Fetch historical readings from API.
 */
export async function fetchHistory(_nodeId: NodeId = 'mota1', points?: number): Promise<HistoricalPoint[]> {
  try {
    const response = await fetch(`${API_BASE}/sensores`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    const readings: SensorReading[] = await response.json();
    
    // Take the last N points
    const limit = points ?? CHART_CONFIG.maxHistoryPoints;
    const recent = readings.slice(-limit);
    
    return recent.map(transformToHistoricalPoint);
  } catch (error) {
    console.error('Failed to fetch history:', error);
    throw error;
  }
}
