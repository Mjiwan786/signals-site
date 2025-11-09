import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Reusable SSE Hook with Exponential Backoff
 *
 * Features:
 * - Automatic reconnection with exponential backoff
 * - Connection state management
 * - Custom event listeners
 * - Cleanup on unmount
 */

interface UseSSEOptions<T> {
  url: string;
  eventName?: string;
  onMessage: (data: T) => void;
  onError?: (error: Event) => void;
  enabled?: boolean;
  reconnectDelays?: number[];
}

interface UseSSEReturn {
  isConnected: boolean;
  error: string | null;
  reconnectAttempt: number;
  disconnect: () => void;
  reconnect: () => void;
}

const DEFAULT_RECONNECT_DELAYS = [1000, 2000, 5000, 10000, 30000]; // ms

export function useSSE<T = any>(options: UseSSEOptions<T>): UseSSEReturn {
  const {
    url,
    eventName = 'message',
    onMessage,
    onError,
    enabled = true,
    reconnectDelays = DEFAULT_RECONNECT_DELAYS,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const connect = useCallback(() => {
    if (!isMountedRef.current || !enabled) return;

    // Clean up existing connection
    disconnect();

    try {
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        if (!isMountedRef.current) return;
        setIsConnected(true);
        setError(null);
        setReconnectAttempt(0);
      };

      const handleMessage = (event: MessageEvent) => {
        if (!isMountedRef.current) return;
        try {
          const data: T = JSON.parse(event.data);
          onMessage(data);
        } catch (err) {
          console.error(`Failed to parse SSE ${eventName} data:`, err);
        }
      };

      if (eventName === 'message') {
        eventSource.onmessage = handleMessage;
      } else {
        eventSource.addEventListener(eventName, handleMessage);
      }

      // Heartbeat listener (if API sends heartbeats)
      eventSource.addEventListener('heartbeat', () => {
        if (!isMountedRef.current) return;
        setIsConnected(true);
      });

      eventSource.onerror = (err) => {
        if (!isMountedRef.current) return;

        console.error('SSE error:', err);
        setIsConnected(false);
        setError('Connection lost');

        if (onError) {
          onError(err);
        }

        eventSource.close();

        // Attempt reconnection with exponential backoff
        const delay = reconnectDelays[Math.min(reconnectAttempt, reconnectDelays.length - 1)];

        reconnectTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current && enabled) {
            setReconnectAttempt((prev) => prev + 1);
            connect();
          }
        }, delay);
      };
    } catch (err) {
      console.error('Failed to create EventSource:', err);
      setError('Failed to connect');
    }
  }, [url, eventName, onMessage, onError, enabled, reconnectAttempt, reconnectDelays, disconnect]);

  const reconnect = useCallback(() => {
    setReconnectAttempt(0);
    connect();
  }, [connect]);

  useEffect(() => {
    isMountedRef.current = true;

    if (enabled) {
      connect();
    }

    return () => {
      isMountedRef.current = false;
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  return {
    isConnected,
    error,
    reconnectAttempt,
    disconnect,
    reconnect,
  };
}
