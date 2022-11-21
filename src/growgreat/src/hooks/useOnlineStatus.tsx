import React, { useState, useContext } from 'react';
import { Detector, Offline, Online } from 'react-detect-offline';

type Props = {
  children: React.ReactNode | null;
};

const OnlineStatusContext = React.createContext({
  isOnline: false,
  Offline,
  Online,
});

export function OnlineStatusProvider(props: Props) {
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
      {props.children}
    </OnlineStatusContext.Provider>
  );
}

export const useOnlineStatus = () => {
  const store = useContext(OnlineStatusContext);
  return store;
};
