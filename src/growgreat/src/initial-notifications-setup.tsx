import { createContext, ReactNode, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { Message } from '@/models/messages/messages';
import { useStoreSetup } from '@/hooks/useStoreSetup';
import { NotificationService } from '@/services/NotificationService/NotificationService';

import { store, useAppDispatch } from '@/store';
import { settingSelectors } from '@/store/settings';
import {
  notificationActions,
  notificationsSelectors,
} from '@/store/notifications';

type Props = {
  children: ReactNode;
};

type IntialNotificationSetupContextValues = {
  startService: () => void;
  stopService: () => void;
};

export const IntialNotificationSetupContext =
  createContext<IntialNotificationSetupContextValues>(
    {} as IntialNotificationSetupContextValues
  );

function InitialNotificationSetup(props: Props) {
  const dispatch = useAppDispatch();
  const notifications = useSelector(notificationsSelectors.getAllNotifications);
  const notificationPollInterval = useSelector(
    settingSelectors.getNotificationPollInterval
  );
  const { initloading } = useStoreSetup();
  const notificationServiceRef = useRef<NotificationService | undefined>(
    undefined
  );

  function onNotificationsReceived(messages: Message[]) {
    const newMessages = messages.filter(
      (message) =>
        !notifications.some(
          (notification: any) =>
            notification.message.reference === message.reference
        )
    );

    if (!!newMessages?.length) {
      dispatch(notificationActions.addNotifications(newMessages));
    }
  }

  function initializeServices() {
    if (!notificationServiceRef.current) {
      notificationServiceRef.current = new NotificationService(
        notificationPollInterval
      );
    }

    notificationServiceRef.current.registerValidators(store);

    notificationServiceRef.current.onNotificationsReceived = (
      messages: Message[]
    ) => {
      if (!initloading) {
        onNotificationsReceived(messages);
      }
    };

    notificationServiceRef.current.initialEvaluate();
    notificationServiceRef.current.start();
  }

  function stopService() {
    if (notificationServiceRef.current) {
      notificationServiceRef.current.stop();
      dispatch(notificationActions.resetNotificationState());
    }
  }

  function startService() {
    if (notificationServiceRef.current) {
      initializeServices();
    }
  }

  useEffect(() => {
    initializeServices();

    return () => stopService();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IntialNotificationSetupContext.Provider
      value={{ stopService, startService }}
    >
      {props.children}
    </IntialNotificationSetupContext.Provider>
  );
}

export default InitialNotificationSetup;
