import { useMemo } from 'react';
import { format } from 'date-fns';
import { HistoricalPoint } from '@/types/sensors';

interface ChartPoint {
  time: string;
  [key: string]: number | string;
}

interface UseChartDataReturn {
  temperatureData: ChartPoint[];
  humidityData: ChartPoint[];
  soilMoistureData: ChartPoint[];
}

/**
 * Transforms the raw history array into Recharts-compatible series.
 * Single-node version — clean, no M1/M2 suffix needed.
 */
export function useChartData(history: HistoricalPoint[]): UseChartDataReturn {
  return useMemo(() => {
    const fmt = (iso: string) => format(new Date(iso), 'HH:mm');

    const temperatureData: ChartPoint[] = history.map(p => ({
      time: fmt(p.timestamp),
      'Temp. Aire': p.airTemp,
      'Temp. Suelo': p.soilTemp,
    }));

    const humidityData: ChartPoint[] = history.map(p => ({
      time: fmt(p.timestamp),
      'Hum. Aire': p.airHumidity,
    }));

    const soilMoistureData: ChartPoint[] = history.map(p => ({
      time: fmt(p.timestamp),
      'Hum. Suelo': p.soilMoisture,
    }));

    return { temperatureData, humidityData, soilMoistureData };
  }, [history]);
}
