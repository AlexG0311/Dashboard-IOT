import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Header } from '@/components/layout/Header';
import { NodePanel } from '@/components/nodes/NodePanel';
import { AlertCard } from '@/components/cards/AlertCard';
import { TemperatureChart } from '@/components/charts/TemperatureChart';
import { HumidityChart } from '@/components/charts/HumidityChart';
import { SoilMoistureChart } from '@/components/charts/SoilMoistureChart';
import { useSensorData } from '@/hooks/useSensorData';
import { useNodeStatus } from '@/hooks/useNodeStatus';
import { useChartData } from '@/hooks/useChartData';

/**
 * Main dashboard page — single node view.
 */
export function Dashboard() {
  const {
    node,
    history,
    alerts,
    isLoading,
    isConnected,
    lastUpdated,
    reconnect,
  } = useSensorData();

  const { status: nodeStatus } = useNodeStatus(node);
  const { temperatureData, humidityData, soilMoistureData } = useChartData(history);

  return (
    <DashboardLayout
      header={
        <Header
          nodeStatus={nodeStatus}
          isConnected={isConnected}
          lastUpdated={lastUpdated}
          reconnect={reconnect}
        />
      }
    >
      {isLoading ? (
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
            <p className="text-sm">Cargando datos de sensores…</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Page heading */}
          <div>
            <h2 className="text-lg font-semibold">Monitoreo en Tiempo Real</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              1 nodo activo · 3 sensores · Intervalo 5s
            </p>
          </div>

          {/* Top row: node panel + alerts */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <NodePanel nodeData={node} nodeStatus={nodeStatus} />
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TemperatureChart data={temperatureData} className="sm:col-span-2" />
              <HumidityChart data={humidityData} />
              <SoilMoistureChart data={soilMoistureData} />
            </div>
          </div>

          {/* Alerts */}
          <AlertCard alerts={alerts} />
        </div>
      )}
    </DashboardLayout>
  );
}
