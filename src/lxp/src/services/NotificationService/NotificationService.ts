import { differenceInMilliseconds } from 'date-fns';
import { EnhancedStore } from '@reduxjs/toolkit';
import { ChildDocumentsNotificationValidator } from './validators/child-documents/childDocumentsNotificationValidator';
import { ChildProgressReportNotificationValidator } from './validators/child-progess-report/childProgressReportNotificationValidator';
import { IncompleteChildRegistrationNotificationValidator } from './validators/child-registration/incompleteChildRegistrationNotificationValidator';
import { IncompletePractitionerInformationNotificationValidator } from './validators/practitioner-profile/incompletePractitionerInformationNotificationValidator';
import { IncompleteCoachInformationNotificationValidator } from './validators/coach-profile/incompleteCoachInformationNotificationValidator';
import { ProgrammePlanningNotificationValidator } from './validators/programme-planning/programmePlanningNotificationValidator';
import { IncompleteTrackAttendanceNotificationValidator } from './validators/track-attendance/incompleteTrackAttendanceNotificationValidator';
import { UserLastLoginNotificationValidator } from './validators/user/userLastLoginNotificationValidator';
import { NotificationValidator } from './NotificationService.types';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';

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
    const currentDate = new Date();
    this.validators = [
      new ChildDocumentsNotificationValidator(store),
      new IncompleteChildRegistrationNotificationValidator(store, currentDate),
      new IncompletePractitionerInformationNotificationValidator(store),
      new IncompleteTrackAttendanceNotificationValidator(store, currentDate),
      new ProgrammePlanningNotificationValidator(store, currentDate),
      new ChildProgressReportNotificationValidator(store, currentDate),
      new IncompleteCoachInformationNotificationValidator(store),
      new UserLastLoginNotificationValidator(store, currentDate),
    ];
  };
}
