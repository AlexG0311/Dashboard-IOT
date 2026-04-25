import { NodeData, NodeId, HistoricalPoint } from '@/types/sensors';
import { CHART_CONFIG } from '@/constants/sensorConfig';

// ─── Mock Data Generator ────────────────────────────────────────────────────

/**
 * Generates a realistic sensor reading for the single node.
 */
export function generateMockReading(nodeId: NodeId = 'mota1'): NodeData {
  const jitter = (max: number) => (Math.random() - 0.5) * max;

  const airTemp = parseFloat((24 + jitter(4)).toFixed(1));
  const soilMoist = Math.max(0, Math.min(100,
    parseFloat((55 + jitter(10)).toFixed(1))
  ));
  // Raw ADC: 0% = ~3200, 100% = ~1200 (inverted capacitive sensor)
  const rawValue = Math.round(3200 - (soilMoist / 100) * 2000);

  return {
    nodeId,
    timestamp: new Date().toISOString(),
    dht22: {
      airTemperature: airTemp,
      airHumidity: parseFloat((65 + jitter(8)).toFixed(1)),
    },
    ds18b20: {
      soilTemperature: parseFloat((20 + jitter(3)).toFixed(2)),
    },
    soilMoisture: {
      moisturePercent: soilMoist,
      rawValue,
    },
  };
}

/**
 * Generates historical data for the last N minutes (one point per minute).
 */
export function generateMockHistory(_nodeId: NodeId = 'mota1', points: number = CHART_CONFIG.maxHistoryPoints): HistoricalPoint[] {
  const jitter = (max: number) => (Math.random() - 0.5) * max;

  return Array.from({ length: points }, (_, i) => {
    const ts = new Date(Date.now() - (points - i) * 60 * 1000);
    return {
      timestamp: ts.toISOString(),
      airTemp: parseFloat((24 + jitter(5)).toFixed(1)),
      soilTemp: parseFloat((20 + jitter(3)).toFixed(2)),
      airHumidity: parseFloat((65 + jitter(10)).toFixed(1)),
      soilMoisture: Math.max(0, Math.min(100,
        parseFloat((55 + jitter(12)).toFixed(1))
      )),
    };
  });
}

// ─── Data Fetchers (API-ready) ──────────────────────────────────────────────

/**
 * Fetch latest sensor reading for the node.
 * Replace with: fetch(`${API_BASE}/node/latest`)
 */
export async function fetchLatestReading(nodeId: NodeId = 'mota1'): Promise<NodeData> {
  await new Promise(r => setTimeout(r, 100));
  return generateMockReading(nodeId);
}

/**
 * Fetch historical readings.
 * Replace with: fetch(`${API_BASE}/node/history?points=${points}`)
 */
export async function fetchHistory(nodeId: NodeId = 'mota1', points?: number): Promise<HistoricalPoint[]> {
  await new Promise(r => setTimeout(r, 150));
  return generateMockHistory(nodeId, points);
}
