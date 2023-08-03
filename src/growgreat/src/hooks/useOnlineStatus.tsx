import React, { useState, useContext } from 'react';
import { Detector, PollingConfig } from 'react-detect-offline';

const OnlineStatusContext = React.createContext({
  isOnline: false,
});

export const OnlineStatusProvider: React.FC<{
  pollUrl: string | null;
  interval: number | 5000;
  timeout: number | 5000;
}> = ({ children, pollUrl, interval, timeout }) => {
  const [onlineStatus, setOnlineStatus] = useState<boolean>(true);

  const value = {
    isOnline: onlineStatus,
  };
  let safeInterval = interval < 1000 ? 1000 : interval;
  let safeTimeout = timeout < 1 ? 1 : timeout;

  return (
    <OnlineStatusContext.Provider value={value}>
      <Detector
        polling={
          {
            interval: safeInterval,
            timeout: safeTimeout,
            url: pollUrl ?? 'http://httpbin.org/get',
          } as PollingConfig
        }
        onChange={(online) => {
          return setOnlineStatus(online);
        }}
        render={({ online }) => {
          return <></>;
        }}
      />
      {children}
    </OnlineStatusContext.Provider>
  );
};

export const useOnlineStatus = () => {
  const store = useContext(OnlineStatusContext);
  return store;
};
