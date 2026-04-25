import { NodeData, NodeStatus } from '@/types/sensors';
import { MetricCard } from '@/components/cards/MetricCard';
import { NodeStatusCard } from '@/components/cards/NodeStatusCard';
import { SENSOR_CONFIG, NODE_CONFIG } from '@/constants/sensorConfig';
import { useNodeStatus } from '@/hooks/useNodeStatus';

interface NodePanelProps {
  nodeData: NodeData | null;
  nodeStatus: NodeStatus;
}

/**
 * Full detail panel for the node: status card + all 4 metric cards.
 */
export function NodePanel({ nodeData, nodeStatus }: NodePanelProps) {
  const { timeSinceLastSeen } = useNodeStatus(nodeData);
  const nodeColor = NODE_CONFIG.mota1.color;
  const nodeColorMuted = NODE_CONFIG.mota1.colorMuted;

  return (
    <div className="space-y-3">
      {/* Node identity */}
      <NodeStatusCard
        nodeId="mota1"
        nodeData={nodeData}
        status={nodeStatus}
        timeSinceLastSeen={timeSinceLastSeen}
      />

      {/* Accent divider */}
      <div className="h-px w-full" style={{ background: `linear-gradient(to right, ${nodeColor}40, transparent)` }} />

      {/* 2×2 sensor metric grid */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label={SENSOR_CONFIG.airTemperature.label}
          value={nodeData?.dht22.airTemperature ?? null}
          unit={SENSOR_CONFIG.airTemperature.unit}
          sensorType="airTemp"
          sensorName={SENSOR_CONFIG.airTemperature.sensor}
          accentColor={SENSOR_CONFIG.airTemperature.color}
          accentColorMuted={SENSOR_CONFIG.airTemperature.colorMuted}
        />
        <MetricCard
          label={SENSOR_CONFIG.airHumidity.label}
          value={nodeData?.dht22.airHumidity ?? null}
          unit={SENSOR_CONFIG.airHumidity.unit}
          sensorType="airHumidity"
          sensorName={SENSOR_CONFIG.airHumidity.sensor}
          accentColor={SENSOR_CONFIG.airHumidity.color}
          accentColorMuted={SENSOR_CONFIG.airHumidity.colorMuted}
        />
        <MetricCard
          label={SENSOR_CONFIG.soilTemperature.label}
          value={nodeData?.ds18b20.soilTemperature ?? null}
          unit={SENSOR_CONFIG.soilTemperature.unit}
          sensorType="soilTemp"
          sensorName={SENSOR_CONFIG.soilTemperature.sensor}
          accentColor={SENSOR_CONFIG.soilTemperature.color}
          accentColorMuted={SENSOR_CONFIG.soilTemperature.colorMuted}
        />
        <MetricCard
          label={SENSOR_CONFIG.soilMoisture.label}
          value={nodeData?.soilMoisture.moisturePercent ?? null}
          unit={SENSOR_CONFIG.soilMoisture.unit}
          sensorType="soilMoisture"
          sensorName={SENSOR_CONFIG.soilMoisture.sensor}
          accentColor={SENSOR_CONFIG.soilMoisture.color}
          accentColorMuted={SENSOR_CONFIG.soilMoisture.colorMuted}
        />
      </div>

      {/* Raw ADC value */}
      {nodeData && (
        <div
          className="rounded-lg border px-3 py-2 flex items-center justify-between"
          style={{ borderColor: `${nodeColor}20`, background: nodeColorMuted }}
        >
          <span className="text-[11px] text-muted-foreground">ADC raw (Cap. Soil)</span>
          <span className="text-xs font-mono font-medium" style={{ color: nodeColor }}>
            {nodeData.soilMoisture.rawValue} / 4095
          </span>
        </div>
      )}
    </div>
  );
}
