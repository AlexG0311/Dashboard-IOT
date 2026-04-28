import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectionIndicatorProps {
  isConnected: boolean;
  isMockMode?: boolean;
  onReconnect?: () => void;
  className?: string;
}

/**
 * Shows WebSocket connection status in the header.
 * In mock mode, shows a special "Simulación" indicator.
 */
export function ConnectionIndicator({
  isConnected,
  isMockMode = false,
  onReconnect,
  className,
}: ConnectionIndicatorProps) {
  if (isMockMode) {
    return (
      <div className={cn('flex items-center gap-2 text-xs text-muted-foreground', className)}>
        <RefreshCw size={12} className="animate-spin-slow text-amber-400" />
        <span className="text-amber-400/70">Modo simulación</span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {isConnected ? (
        <>
          <Wifi size={14} className="text-green-400" />
          <span className="text-xs text-green-400/70">WebSocket</span>
        </>
      ) : (
        <button
          onClick={onReconnect}
          className="flex items-center gap-2 rounded-md px-2 py-1 text-xs text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <WifiOff size={14} />
          <span>Sin conexión — Reconectar</span>
        </button>
      )}
    </div>
  );
}
