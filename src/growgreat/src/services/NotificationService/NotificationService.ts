import { EnhancedStore } from '@reduxjs/toolkit';
import { differenceInMilliseconds } from 'date-fns';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import { NotificationValidator } from './NotificationService.types';
import { IncompletePractitionerInformationNotificationValidator } from './validators/practitioner-profile/incompletePractitionerInformationNotificationValidator';

export class NotificationService {
  interval: number;
  validators: NotificationValidator[];
  timeout?: NodeJS.Timeout;
  onNotificationsReceived?: (notifications: Message[]) => void;

  constructor(interval: number) {
    this.interval = interval;
    this.validators = [];
  }

  start = () => {
    this.timeout = setInterval(() => {
      const notifications = this.evaluateNotifications();
      this.onNotificationsReceived &&
        this.onNotificationsReceived(notifications);
    }, this.interval);
  };

  stop = () => {
    if (!this.timeout) return;
    clearInterval(this.timeout);
  };

  initialEvaluate = () => {
    const notifications = this.evaluateNotifications();
    this.onNotificationsReceived && this.onNotificationsReceived(notifications);
  };

  evaluateNotifications = (): Message[] => {
    const notifications = [];
    for (let validator of this.validators) {
      const differenceInMs = differenceInMilliseconds(
        new Date(),
        validator.lastCheckTimestamp
      );
      if (Math.abs(differenceInMs) > validator.interval) {
        const validatorNotifications = validator.getNotifications();
        notifications.push(...validatorNotifications);
      }

      validator.lastCheckTimestamp = new Date().valueOf();
    }
    return notifications;
  };

  registerValidators = (store: EnhancedStore<RootState, any>) => {
    this.validators = [
      new IncompletePractitionerInformationNotificationValidator(store),
    ];
  };
}
