import { useContext } from 'react';
import { IntialNotificationSetupContext } from '../initial-notifications-setup';

export const useNotificationService = () =>
  useContext(IntialNotificationSetupContext);
