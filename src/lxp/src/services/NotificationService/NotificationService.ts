import { differenceInMilliseconds } from 'date-fns';
import { EnhancedStore } from '@reduxjs/toolkit';
import { ChildDocumentsNotificationValidator } from './validators/child-documents/childDocumentsNotificationValidator';
import { ChildProgressReportNotificationValidator } from './validators/child-progess-report/childProgressReportNotificationValidator';
import { IncompleteChildRegistrationNotificationValidator } from './validators/child-registration/incompleteChildRegistrationNotificationValidator';
import { IncompletePractitionerInformationNotificationValidator } from './validators/practitioner-profile/incompletePractitionerInformationNotificationValidator';
import { ProgrammePlanningNotificationValidator } from './validators/programme-planning/programmePlanningNotificationValidator';
import { IncompleteTrackAttendanceNotificationValidator } from './validators/track-attendance/incompleteTrackAttendanceNotificationValidator';
import { UserLastLoginNotificationValidator } from './validators/user/userLastLoginNotificationValidator';
import { NotificationValidator } from './NotificationService.types';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import { RoleSystemNameEnum, UserDto } from '@ecdlink/core';
import { BackendNotificationsValidator } from './validators/backend-notifications/backendNotificationsValidador';
import { PointsNotificationValidator } from './validators/points/pointsNotificationValidator';
import { PractitionerNotificationValidator } from './validators/practitionerNotificationsValidator.ts/practitionerNotificationsValidator';

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

  registerValidators = (
    store: EnhancedStore<RootState, any>,
    applicationName: String
  ) => {
    const isCoach = this.user?.roles?.some(
      (role) => role.systemName === RoleSystemNameEnum.Coach
    );
    const currentDate = new Date();
    this.validators = [
      new ChildDocumentsNotificationValidator(store),
      new IncompleteChildRegistrationNotificationValidator(store, currentDate),
      new IncompletePractitionerInformationNotificationValidator(store),
      new IncompleteTrackAttendanceNotificationValidator(store, currentDate),
      new ProgrammePlanningNotificationValidator(store, currentDate),
      new ChildProgressReportNotificationValidator(store, currentDate),
      new UserLastLoginNotificationValidator(
        store,
        currentDate,
        applicationName,
        isCoach || false
      ),
      new PointsNotificationValidator(store, currentDate),
      new PractitionerNotificationValidator(store, currentDate),
    ];
  };
}
