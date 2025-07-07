import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Message } from './models/messages/messages';
import { NotificationService } from './services/NotificationService/NotificationService';
import { store, useAppDispatch } from './store';
import {
  notificationActions,
  notificationsSelectors,
} from './store/notifications';
import { settingSelectors } from './store/settings';
import { userSelectors } from './store/user';
import { authSelectors } from './store/auth';
import Loader from './components/loader/loader';
import { useTenant } from './hooks/useTenant';

type IntialNotificationSetupContextValues = {
  startService: () => void;
  stopService: () => void;
};

export const IntialNotificationSetupContext =
  React.createContext<IntialNotificationSetupContextValues>(
    {} as IntialNotificationSetupContextValues
  );

const InitialNotificationSetup: React.FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const tenant = useTenant();

  const user = useSelector(userSelectors.getUser);
  const auth = useSelector(authSelectors.getAuthUser);

  const notificationReferences = useSelector(
    notificationsSelectors.getAllNotificationReferences
  );
  const notificationPollInterval = useSelector(
    settingSelectors.getNotificationPollInterval
  );
  // const { initloading: initLoading } = useStoreSetup();
  const notificationServiceRef = useRef<NotificationService | undefined>(
    undefined
  );

  useEffect(() => {
    async function init() {
      if (user !== undefined) {
        await initializeServices();
      }
    }
    init().catch(console.error);
    return () => {
      stopService();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onNotificationsRecieved = useCallback(
    (messages: Message[]) => {
      const newMessages = messages.filter(
        (message) => !notificationReferences.includes(message.reference)
      );

      if (newMessages.length > 0) {
        dispatch(notificationActions.addNotifications(newMessages));
      }
    },
    [dispatch, notificationReferences]
  );

  const initializeServices = useCallback(async () => {
    setIsLoading(true);

    if (!notificationServiceRef.current) {
      notificationServiceRef.current = new NotificationService(
        notificationPollInterval,
        auth?.auth_token,
        user
      );
    }
    notificationServiceRef.current.registerValidators(
      store,
      tenant.tenant?.applicationName || ''
    );

    notificationServiceRef.current.onNotificationsReceived = (
      messages: Message[]
    ) => {
      onNotificationsRecieved(messages);
    };
    notificationServiceRef.current.initialEvaluate();
    notificationServiceRef.current.start();
    setIsLoading(false);
  }, [
    auth?.auth_token,
    notificationPollInterval,
    onNotificationsRecieved,
    tenant.tenant?.applicationName,
    user,
  ]);

  const stopService = () => {
    if (notificationServiceRef.current) {
      notificationServiceRef.current.stop();
      dispatch(notificationActions.resetFrontendNotificationState());
    }
  };

  const startService = () => {
    if (notificationServiceRef.current) {
      initializeServices();
    }
  };

  const values = {
    stopService,
    startService,
    isLoading,
  };

  return (
    <IntialNotificationSetupContext.Provider value={values}>
      {!isLoading && children}
      {isLoading && <Loader loadingMessage="Loading notifications ..." />}
    </IntialNotificationSetupContext.Provider>
  );
};

export default InitialNotificationSetup;
