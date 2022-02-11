import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useStoreSetup } from './hooks/useStoreSetup';
import { Message } from './models/messages/messages';
import { NotificationService } from './services/NotificationService/NotificationService';
import { store, useAppDispatch } from './store';
import { notificationActions, notificationsSelectors } from './store/notifications';
import { settingSelectors } from './store/settings';

type IntialNotificationSetupContextValues = {
  startService: () => void;
  stopService: () => void;
};

export const IntialNotificationSetupContext =
  React.createContext<IntialNotificationSetupContextValues>(
    {} as IntialNotificationSetupContextValues
  );

const InitialNotificationSetup: React.FC = ({ children }) => {
  const dispatch = useAppDispatch();
  const notifications = useSelector(notificationsSelectors.getAllNotifications);
  const notificationPollInterval = useSelector(settingSelectors.getNotificationPollInterval);
  const { initloading } = useStoreSetup();
  const notificationServiceRef = useRef<NotificationService | undefined>(undefined);

  useEffect(() => {
    initializeServices();
    return () => {
      stopService();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onNotificationsRecieved = (messages: Message[]) => {
    const newMessages = messages.filter(
      (message) =>
        !notifications.some((notification) => notification.message.reference === message.reference)
    );

    if (newMessages.length > 0) dispatch(notificationActions.addNotifications(newMessages));
  };

  const initializeServices = () => {
    if (!notificationServiceRef.current) {
      notificationServiceRef.current = new NotificationService(notificationPollInterval);
    }
    notificationServiceRef.current.registerValidators(store);
    notificationServiceRef.current.onNotificationsReceived = (messages: Message[]) => {
      if (!initloading) {
        onNotificationsRecieved(messages);
      }
    };
    notificationServiceRef.current.initialEvaluate();
    notificationServiceRef.current.start();
  };

  const stopService = () => {
    if (notificationServiceRef.current) {
      notificationServiceRef.current.stop();
      dispatch(notificationActions.resetNotificationState());
    }
  };

  const startService = () => {
    if (notificationServiceRef.current) {
      initializeServices();
    }
  };

  return (
    <IntialNotificationSetupContext.Provider value={{ stopService, startService }}>
      {children}
    </IntialNotificationSetupContext.Provider>
  );
};

export default InitialNotificationSetup;
