import { useState, useEffect, useCallback, useRef } from 'react';
import { NodeData, HistoricalPoint, SensorAlert, AlertSeverity } from '@/types/sensors';
import { THRESHOLDS, CHART_CONFIG } from '@/constants/sensorConfig';
import { fetchLatestReading, fetchHistory } from '@/services/sensorApi';
import { useWebSocket } from './useWebSocket';

interface UseSensorDataReturn {
  node: NodeData | null;
  history: HistoricalPoint[];
  alerts: SensorAlert[];
  isLoading: boolean;
  isConnected: boolean;
  connectionStatus: string;
  lastUpdated: Date | null;
  reconnect: () => void;
}

const POLL_INTERVAL_MS = 5000;

/**
 * Main data hook — orchestrates WebSocket (real) or polling (mock) data
 * for the single node.
 */
export function useSensorData(): UseSensorDataReturn {
  const [node, setNode] = useState<NodeData | null>(null);
  const [history, setHistory] = useState<HistoricalPoint[]>([]);
  const [alerts, setAlerts] = useState<SensorAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const { connectionStatus, lastMessage, reconnect } = useWebSocket();
  const isPollingMode = !import.meta.env.VITE_WS_URL;
  const mockIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Threshold alert generator ──────────────────────────────────────────
  const checkAlerts = useCallback((data: NodeData) => {
    const newAlerts: SensorAlert[] = [];
    const ts = new Date().toISOString();
    const { nodeId, dht22, ds18b20, soilMoisture } = data;

    const check = (value: number, key: keyof typeof THRESHOLDS, sensor: string, label: string, sev: AlertSeverity = 'warning') => {
      const { min, max, unit } = THRESHOLDS[key];
      if (value < min) newAlerts.push({ id: `${nodeId}-${key}-low-${ts}`, nodeId, sensor, message: `${label} bajo: ${value}${unit} (mín ${min}${unit})`, severity: sev, timestamp: ts });
      if (value > max) newAlerts.push({ id: `${nodeId}-${key}-high-${ts}`, nodeId, sensor, message: `${label} alto: ${value}${unit} (máx ${max}${unit})`, severity: sev, timestamp: ts });
    };

    check(dht22.airTemperature, 'airTemperature', 'DHT22', 'Temp. aire');
    check(dht22.airHumidity, 'airHumidity', 'DHT22', 'Hum. aire');
    check(ds18b20.soilTemperature, 'soilTemperature', 'DS18B20', 'Temp. suelo');
    check(soilMoisture.moisturePercent, 'soilMoisture', 'Cap. Soil', 'Hum. suelo');

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 20));
    }
  }, []);

  // ── Append reading to rolling history ──────────────────────────────────
  const appendHistory = useCallback((data: NodeData) => {
    const point: HistoricalPoint = {
      timestamp: data.timestamp,
      airTemp: data.dht22.airTemperature,
      soilTemp: data.ds18b20.soilTemperature,
      airHumidity: data.dht22.airHumidity,
      soilMoisture: data.soilMoisture.moisturePercent,
    };
    setHistory(prev => [...prev, point].slice(-CHART_CONFIG.maxHistoryPoints));
  }, []);

  // ── Apply incoming reading ─────────────────────────────────────────────
  const applyReading = useCallback((data: NodeData) => {
    setNode(data);
    appendHistory(data);
    checkAlerts(data);
    setLastUpdated(new Date());
    setIsLoading(false);
  }, [appendHistory, checkAlerts]);

  // ── Load initial history ───────────────────────────────────────────────
  useEffect(() => {
    const loadInitial = async () => {
      const h = await fetchHistory('mota1');
      setHistory(h);
      if (isPollingMode) {
        const latest = await fetchLatestReading('mota1');
        applyReading(latest);
      }
    };
    loadInitial();
  }, [isPollingMode, applyReading]);

  // ── WebSocket messages (real mode) ──────────────────────────────────────
  useEffect(() => {
    if (!isPollingMode && lastMessage?.type === 'sensor_update') {
      applyReading(lastMessage.payload as NodeData);
    }
  }, [lastMessage, isPollingMode, applyReading]);

  // ── Mock polling (mock mode) ────────────────────────────────────────────
  useEffect(() => {
    if (!isPollingMode) return;
    mockIntervalRef.current = setInterval(async () => {
      const latest = await fetchLatestReading('mota1');
      applyReading(latest);
    }, POLL_INTERVAL_MS);
    return () => { if (mockIntervalRef.current) clearInterval(mockIntervalRef.current); };
  }, [isPollingMode, applyReading]);

  return {
    node,
    history,
    alerts,
    isLoading,
    isConnected: connectionStatus === 'connected',
    connectionStatus,
    lastUpdated,
    reconnect,
  };
}
