import { RecursivePartial } from '@ecdlink/core';
import { EnhancedStore } from '@reduxjs/toolkit';
import { RootState } from '@store/types';
import {
  NotificationIntervals,
  NotificationPriority,
} from '../../NotificationService.types';
import { ProgrammePlanningNotificationValidator } from './programmePlanningNotificationValidator';

describe('ProgrammePlanningNotificationValidator', () => {
  test('should be able to create successfully', () => {
    const store: any = {};
    const validator = new ProgrammePlanningNotificationValidator(
      store,
      new Date()
    );

    expect(validator.interval).toEqual(NotificationIntervals.hour);
  });

  test('should return empty array when store is empty', () => {
    const store: RecursivePartial<EnhancedStore<RootState, any>> = {
      getState: () => ({}),
    };
    const validator = new ProgrammePlanningNotificationValidator(
      store as EnhancedStore<RootState, any>,
      new Date()
    );
    const notifications = validator.getNotifications();
    expect(notifications).toEqual([]);
  });

  test('should return notifications visible on the dashboard with the highest priority', () => {
    const store: RecursivePartial<EnhancedStore<RootState, any>> = {
      getState: () => ({
        programmeData: {
          programmes: [
            {
              startDate: '06/18/2021',
            },
          ],
        },
        user: {
          user: {
            createdDate: '06/18/2021',
          },
        },
      }),
    };
    const validator = new ProgrammePlanningNotificationValidator(
      store as EnhancedStore<RootState, any>,
      new Date()
    );
    const notifications = validator.getNotifications();
    const notification = notifications[0];

    expect(notifications.length).toEqual(1);
    expect(notification.viewType).toEqual('Hub');
    expect(notification.priority).toEqual(NotificationPriority.highest);
  });

  test('should return when you are in the middle of two month period with no programmes planned', () => {
    const store: RecursivePartial<EnhancedStore<RootState, any>> = {
      getState: () => ({
        programmeData: {
          programmes: [
            {
              startDate: '09/02/2021',
              endDate: '09/18/2021',
            },
            {
              startDate: '12/18/2021',
              endDate: '1/18/2022',
            },
          ],
        },
        user: {
          user: {
            createdDate: '06/18/2021',
          },
        },
      }),
    };
    const validator = new ProgrammePlanningNotificationValidator(
      store as EnhancedStore<RootState, any>,
      new Date('11-12-2021')
    );
    const notifications = validator.getNotifications();
    expect(notifications.length).toEqual(1);
  });

  test('should only notifications if user has registered at least a month ago', () => {
    const store: RecursivePartial<EnhancedStore<RootState, any>> = {
      getState: () => ({
        programmeData: {
          programmes: [
            {
              startDate: '06/18/2021',
            },
          ],
        },
        user: {
          user: {
            createdDate: '06/18/2021',
          },
        },
      }),
    };
    const validator = new ProgrammePlanningNotificationValidator(
      store as EnhancedStore<RootState, any>,
      new Date()
    );
    const notifications = validator.getNotifications();
    expect(notifications.length).toEqual(1);
  });

  test('should not return notifications if user has not registered at least a month ago', () => {
    const store: RecursivePartial<EnhancedStore<RootState, any>> = {
      getState: () => ({
        programmeData: {
          programmes: [
            {
              startDate: '06/18/2021',
            },
          ],
        },
        user: {
          user: {
            createdDate: new Date(),
          },
        },
      }),
    };
    const validator = new ProgrammePlanningNotificationValidator(
      store as EnhancedStore<RootState, any>,
      new Date()
    );
    const notifications = validator.getNotifications();
    expect(notifications.length).toEqual(0);
  });
});
