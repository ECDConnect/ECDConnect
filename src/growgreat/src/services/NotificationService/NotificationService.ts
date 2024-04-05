import { EnhancedStore } from '@reduxjs/toolkit';
import { differenceInMilliseconds } from 'date-fns';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import { NotificationValidator } from './NotificationService.types';
import { IncompletePractitionerInformationNotificationValidator } from './validators/practitioner-profile/incompletePractitionerInformationNotificationValidator';
import { UserDto } from '@ecdlink/core';
import { UserLastLoginNotificationValidator } from './validators/user/userLastLoginNotificationValidator';
import { BackendNotificationsValidator } from './validators/backend-notifications/backendNotificationsValidador';
import { VisitsNotCompletedNotificationValidator } from './validators/visits/visitsNotCompletedNotificationValidator';
import { InfantDocumentsNotificationValidator } from './validators/infant-documents/infantDocumentsNotificationValidator';

export class NotificationService {
  interval: number;
  validators: NotificationValidator[];
  user?: UserDto;
  timeout?: NodeJS.Timeout;
  _accessToken?: string;
  onNotificationsReceived?: (notifications: Message[]) => void;

  constructor(interval: number, accessToken?: string, user?: UserDto) {
    this.interval = interval;
    this.validators = [];
    this._accessToken = accessToken;
    this.user = user;
  }

  start = () => {
    this.timeout = setInterval(async () => {
      const notifications = await this.evaluateNotifications();
      this.onNotificationsReceived &&
        this.onNotificationsReceived(notifications);
    }, this.interval);
  };

  stop = () => {
    if (!this.timeout) return;
    clearInterval(this.timeout);
  };

  initialEvaluate = () => {
    this.evaluateNotifications().then((notifications) => {
      this.onNotificationsReceived?.(notifications);
    });
  };

  evaluateNotifications = async (): Promise<Message[]> => {
    const notifications = [];
    const backendValidator = new BackendNotificationsValidator(
      this._accessToken,
      this.user
    );
    const backendNotifications = await backendValidator.getNotifications();
    notifications.push(...(backendNotifications ?? []));

    for (let validator of this.validators) {
      const differenceInMs = differenceInMilliseconds(
        new Date(),
        validator.lastCheckTimestamp
      );
      if (Math.abs(differenceInMs) > validator.interval) {
        const validatorNotifications =
          validator.getNotifications() as Message[];
        notifications.push(...validatorNotifications);
      }

      validator.lastCheckTimestamp = new Date().valueOf();
    }
    return notifications;
  };

  registerValidators = (store: EnhancedStore<RootState, any>) => {
    const currentDate = new Date();
    this.validators = [
      new IncompletePractitionerInformationNotificationValidator(store),
      new UserLastLoginNotificationValidator(store, currentDate),
      new VisitsNotCompletedNotificationValidator(store),
      new InfantDocumentsNotificationValidator(store),
    ];
  };
}
