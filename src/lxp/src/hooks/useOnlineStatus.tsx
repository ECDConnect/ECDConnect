import React, { useState, useContext } from 'react';
import { Detector, Offline, Online } from 'react-detect-offline';

const OnlineStatusContext = React.createContext({
  isOnline: false,
  Offline,
  Online,
});

export const OnlineStatusProvider: React.FC = ({ children }) => {
  const [onlineStatus, setOnlineStatus] = useState<boolean>(true);

  const value = {
    isOnline: onlineStatus,
    Offline,
    Online,
  };

  return (
    <OnlineStatusContext.Provider value={value}>
      <Detector
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
