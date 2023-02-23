import React, { useState, useContext } from 'react';
import { Detector, PollingConfig } from 'react-detect-offline';

const OnlineStatusContext = React.createContext({
  isOnline: false,
});

export const OnlineStatusProvider: React.FC = ({ children }) => {
  const [onlineStatus, setOnlineStatus] = useState<boolean>(true);

  const value = {
    isOnline: onlineStatus,
  };

  return (
    <OnlineStatusContext.Provider value={value}>
      <Detector
        polling={
          {
            interval: 3000,
            timeout: 2000,
            url: 'https://localhost:5001/api/authentication/online-check',
          } as PollingConfig
        }
        render={({ online }) => {
          setOnlineStatus(online);
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
