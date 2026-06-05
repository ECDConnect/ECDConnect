import React, { useState, useContext, useEffect, useRef } from 'react';

interface OnlineStatusContextType {
  isOnline: boolean;
}

const OnlineStatusContext = React.createContext<OnlineStatusContextType>({
  isOnline: true,
});

interface OnlineStatusProviderProps {
  children: React.ReactNode;
  pollUrl?: string;
  interval?: number;
  timeout?: number;
  enablePolling?: boolean;
  onConnectionRestored?: () => void;
  onConnectionLost?: () => void;
}

export const OnlineStatusProvider: React.FC<OnlineStatusProviderProps> = ({
  children,
  pollUrl = 'https://httpbin.org/get',
  interval = 5000,
  timeout = 15000,
  enablePolling = false,
  onConnectionRestored,
  onConnectionLost,
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(() => navigator.onLine);
  const wasOnlineRef = useRef<boolean>(navigator.onLine);
  const isCheckingRef = useRef<boolean>(false);
  const intervalIdRef = useRef<number>();
  const controllerRef = useRef<AbortController>();

  // Primary: use SW as source of truth when available — SW probes the real network
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleSWMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SW_ONLINE_STATUS') {
        setIsOnline(event.data.isOnline as boolean);
      }
    };

    navigator.serviceWorker.addEventListener('message', handleSWMessage);

    const probe = () =>
      navigator.serviceWorker.controller?.postMessage({
        type: 'GET_ONLINE_STATUS',
        pollUrl,
      });

    probe();
    const intervalId = setInterval(probe, interval);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleSWMessage);
      clearInterval(intervalId);
    };
  }, [interval, pollUrl]);

  // Fallback: window events for when no SW is controlling the page
  useEffect(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller)
      return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline && !wasOnlineRef.current) {
      onConnectionRestored?.();
    }
    if (!isOnline && wasOnlineRef.current) {
      onConnectionLost?.();
    }
    wasOnlineRef.current = isOnline;
  }, [isOnline, onConnectionRestored, onConnectionLost]);

  const cleanup = () => {
    if (intervalIdRef.current) {
      window.clearInterval(intervalIdRef.current);
      intervalIdRef.current = undefined;
    }
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = undefined;
    }
    isCheckingRef.current = false;
  };

  useEffect(() => {
    if (!enablePolling) {
      cleanup();
      return;
    }

    const safeInterval = Math.max(interval, 1000);
    const safeTimeout = Math.max(timeout, 5000);

    const checkConnection = async () => {
      if (isCheckingRef.current) {
        return;
      }

      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      isCheckingRef.current = true;
      controllerRef.current = new AbortController();

      try {
        const response = await Promise.race([
          fetch(pollUrl, {
            method: 'HEAD',
            cache: 'no-store',
            signal: controllerRef.current.signal,
          }),
          new Promise<never>((_, reject) => {
            setTimeout(() => {
              reject(new Error('Timeout'));
            }, safeTimeout);
          }),
        ]);

        if (response.ok) {
          setIsOnline(true);
        } else {
          setIsOnline(false);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          setIsOnline(false);
        }
      } finally {
        isCheckingRef.current = false;
        controllerRef.current = undefined;
      }
    };

    cleanup();
    checkConnection();
    intervalIdRef.current = window.setInterval(checkConnection, safeInterval);

    return cleanup;
  }, [enablePolling, interval, timeout, pollUrl]);

  return (
    <OnlineStatusContext.Provider value={{ isOnline }}>
      {children}
    </OnlineStatusContext.Provider>
  );
};

export const useOnlineStatus = () => {
  const context = useContext(OnlineStatusContext);

  if (context === undefined) {
    throw new Error(
      'useOnlineStatus must be used within an OnlineStatusProvider'
    );
  }

  return context;
};
