import { useState, useEffect, useRef, useCallback } from 'react';
import { WS_CONFIG } from '@/constants/sensorConfig';
import { WSMessage, NodeData, NodeId, NodeStatus } from '@/types/sensors';

export type WSConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface UseWebSocketReturn {
  connectionStatus: WSConnectionStatus;
  lastMessage: WSMessage | null;
  sendMessage: (msg: object) => void;
  reconnect: () => void;
}

/**
 * Low-level WebSocket hook.
 * Handles connection lifecycle, auto-reconnect, and ping/pong.
 *
 * When the gateway is not available, it falls back to mock mode
 * (no WS connection attempted) unless VITE_WS_URL is defined.
 */
export function useWebSocket(): UseWebSocketReturn {
  const [connectionStatus, setConnectionStatus] = useState<WSConnectionStatus>('disconnected');
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pingTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMockMode = !import.meta.env.VITE_WS_URL;

  const clearTimers = useCallback(() => {
    if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    if (pingTimer.current) clearInterval(pingTimer.current);
  }, []);

  const connect = useCallback(() => {
    if (isMockMode) {
      // Mock mode: simulate connected state, data arrives via polling hook
      setConnectionStatus('connected');
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setConnectionStatus('connecting');

    try {
      const ws = new WebSocket(WS_CONFIG.url);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus('connected');
        reconnectAttempts.current = 0;

        // Start ping interval to keep connection alive
        pingTimer.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, WS_CONFIG.pingInterval);
      };

      ws.onmessage = (event: MessageEvent) => {
        try {
          const message = JSON.parse(event.data as string) as WSMessage;
          setLastMessage(message);
        } catch {
          console.warn('[WS] Failed to parse message:', event.data);
        }
      };

      ws.onerror = () => {
        setConnectionStatus('error');
      };

      ws.onclose = () => {
        clearTimers();
        setConnectionStatus('disconnected');

        if (reconnectAttempts.current < WS_CONFIG.maxReconnectAttempts) {
          reconnectAttempts.current += 1;
          reconnectTimer.current = setTimeout(connect, WS_CONFIG.reconnectDelay);
        }
      };
    } catch {
      setConnectionStatus('error');
    }
  }, [isMockMode, clearTimers]);

  const disconnect = useCallback(() => {
    clearTimers();
    wsRef.current?.close();
    wsRef.current = null;
  }, [clearTimers]);

  const sendMessage = useCallback((msg: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  const reconnect = useCallback(() => {
    reconnectAttempts.current = 0;
    disconnect();
    connect();
  }, [connect, disconnect]);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { connectionStatus, lastMessage, sendMessage, reconnect };
}

// ─── Re-export types used by consumers ────────────────────────────────────
export type { WSMessage, NodeData, NodeId, NodeStatus };
