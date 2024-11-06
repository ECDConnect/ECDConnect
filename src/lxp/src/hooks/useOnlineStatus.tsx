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
}

export const OnlineStatusProvider: React.FC<OnlineStatusProviderProps> = ({
  children,
  pollUrl = 'https://httpbin.org/get',
  interval = 5000,
  timeout = 15000,
  enablePolling = false,
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(() => navigator.onLine);
  const lastSuccessfulCheckRef = useRef<number>(Date.now());
  const isCheckingRef = useRef<boolean>(false);
  const intervalIdRef = useRef<number>();
  const controllerRef = useRef<AbortController>();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
        const timeSinceLastSuccess =
          Date.now() - lastSuccessfulCheckRef.current;
        if (timeSinceLastSuccess > safeTimeout * 2) {
          setIsOnline(false);
        }

        const response = (await Promise.race([
          fetch(pollUrl, {
            method: 'GET',
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Cache-Control': 'no-cache',
            },
            signal: controllerRef.current.signal,
          }),
          new Promise<never>((_, reject) => {
            setTimeout(() => {
              reject(new Error('Timeout'));
            }, safeTimeout);
          }),
        ])) as Response; // Type assertion here

        if (response.ok) {
          lastSuccessfulCheckRef.current = Date.now();
          setIsOnline(true);
        } else {
          setIsOnline(false);
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.name !== 'AbortError') {
            setIsOnline(false);
          }
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
