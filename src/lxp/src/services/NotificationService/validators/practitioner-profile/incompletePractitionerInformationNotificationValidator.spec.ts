import { RecursivePartial } from '@ecdlink/core';
import { EnhancedStore } from '@reduxjs/toolkit';
import { RootState } from '@store/types';
import {
  NotificationIntervals,
  NotificationPriority,
} from '../../NotificationService.types';
import { IncompletePractitionerInformationNotificationValidator } from './incompletePractitionerInformationNotificationValidator';

describe('incompletePractitionerInformationNotificationValidator', () => {
  test('should be able to create successfully', () => {
    const store: any = {};
    const validator =
      new IncompletePractitionerInformationNotificationValidator(store);

    expect(validator.interval).toEqual(NotificationIntervals.hour);
  });

  test('should return empty array when store is empty', () => {
    const store: RecursivePartial<EnhancedStore<RootState, any>> = {
      getState: () => ({}),
    };
    const validator =
      new IncompletePractitionerInformationNotificationValidator(
        store as EnhancedStore<RootState, any>
      );
    const notifications = validator.getNotifications();
    expect(notifications).toEqual([]);
  });

  test('should return notifications with a lower priority and only be visible on the home screen', () => {
    const store: RecursivePartial<EnhancedStore<RootState, any>> = {
      getState: () => ({
        classroomData: {},
        practitioner: {
          practitioner: { id: '1' },
        },
      }),
    };
    const validator =
      new IncompletePractitionerInformationNotificationValidator(
        store as EnhancedStore<RootState, any>
      );
    const notifications = validator.getNotifications();
    const notification = notifications[0];

    expect(notifications.length).toEqual(1);
    expect(notification.viewType).toEqual('Hub');
    expect(notification.priority).toEqual(NotificationPriority.lower);
  });

  test('should not return any notifications when classroom is set on classroom state', () => {
    const store: RecursivePartial<EnhancedStore<RootState, any>> = {
      getState: () => ({
        classroomData: {
          classroom: {},
        },
        practitioner: {
          practitioner: { id: '1' },
        },
      }),
    };
    const validator =
      new IncompletePractitionerInformationNotificationValidator(
        store as EnhancedStore<RootState, any>
      );
    const notifications = validator.getNotifications();

    expect(notifications.length).toEqual(0);
  });
});
