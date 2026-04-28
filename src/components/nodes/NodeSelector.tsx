import { NodeId } from '@/types/sensors';
import { NODE_CONFIG } from '@/constants/sensorConfig';
import { cn } from '@/lib/utils';

interface NodeSelectorProps {
  activeNode: NodeId | 'all';
  onChange: (node: NodeId | 'all') => void;
  className?: string;
}

type Tab = { id: NodeId | 'all'; label: string; color?: string };

const TABS: Tab[] = [
  { id: 'all', label: 'General' },
  { id: 'mota1', label: NODE_CONFIG.mota1.label, color: NODE_CONFIG.mota1.color },
];

/**
 * Tab-based node selector for switching between "All nodes" overview
 * and individual node detail view.
 */
export function NodeSelector({ activeNode, onChange, className }: NodeSelectorProps) {
  return (
    <div
      className={cn(
        'inline-flex rounded-lg border border-border bg-card p-1 gap-1',
        className
      )}
    >
      {TABS.map((tab) => {
        const isActive = activeNode === tab.id;
        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200',
              isActive
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground/80'
            )}
            style={isActive ? {
              background: tab.color ? `${tab.color}18` : 'hsl(var(--accent))',
              color: tab.color ?? undefined,
              boxShadow: tab.color ? `0 0 0 1px ${tab.color}30` : undefined,
            } : {}}
          >
            {tab.color && (
              <span
                className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: tab.color, opacity: isActive ? 1 : 0.5 }}
              />
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
