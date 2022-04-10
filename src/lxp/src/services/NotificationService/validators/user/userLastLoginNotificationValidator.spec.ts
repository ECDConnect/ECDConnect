import { RecursivePartial } from '@ecdlink/core';
import { EnhancedStore } from '@reduxjs/toolkit';
import { RootState } from '@store/types';
import { NotificationIntervals } from '../../NotificationService.types';
import { UserLastLoginNotificationValidator } from './userLastLoginNotificationValidator';

describe('UserLastLoginNotificationValidator', () => {
  test('should be able to create successfully', () => {
    const store: any = {};
    const validator = new UserLastLoginNotificationValidator(store, new Date());

    expect(validator.interval).toEqual(NotificationIntervals.hour);
  });

  test('should return empty array when store is empty', () => {
    const store: RecursivePartial<EnhancedStore<RootState, any>> = {
      getState: () => ({}),
    };
    const validator = new UserLastLoginNotificationValidator(
      store as EnhancedStore<RootState, any>,
      new Date()
    );
    const notifications = validator.getNotifications();
    expect(notifications).toEqual([]);
  });

  test('should return notifications', () => {
    const store: RecursivePartial<EnhancedStore<RootState, any>> = {
      getState: () => ({
        settings: {
          lastDataSync: '11-15-2021',
        },
      }),
    };
    const validator = new UserLastLoginNotificationValidator(
      store as EnhancedStore<RootState, any>,
      new Date()
    );
    const notifications = validator.getNotifications();
    expect(notifications.length).toEqual(1);
  });

  test('should return 7 day notification if the user have not synced in 7 days', () => {
    const validStore: RecursivePartial<EnhancedStore<RootState, any>> = {
      getState: () => ({
        settings: {
          lastDataSync: '11-15-2021',
        },
      }),
    };
    const validator = new UserLastLoginNotificationValidator(
      validStore as EnhancedStore<RootState, any>,
      new Date('11-22-2021')
    );

    const notifications = validator.getNotifications();

    expect(notifications.length).toEqual(1);
    const notification = notifications[0];
    expect(notification.reference.endsWith('-7')).toBeTruthy();
  });

  test('should return 14 day notification if the user have not synced in 14 days', () => {
    const validStore: RecursivePartial<EnhancedStore<RootState, any>> = {
      getState: () => ({
        settings: {
          lastDataSync: '11-07-2021',
        },
      }),
    };

    const validator = new UserLastLoginNotificationValidator(
      validStore as EnhancedStore<RootState, any>,
      new Date('11-22-2021')
    );

    const notifications = validator.getNotifications();
    const notification = notifications[0];
    expect(notification.reference.endsWith('-14')).toBeTruthy();
    expect(notifications.length).toEqual(1);
  });

  test('should return 21 day notification if the user have not synced in 21 days', () => {
    const validStore: RecursivePartial<EnhancedStore<RootState, any>> = {
      getState: () => ({
        settings: {
          lastDataSync: '11-01-2021',
        },
      }),
    };

    const validator = new UserLastLoginNotificationValidator(
      validStore as EnhancedStore<RootState, any>,
      new Date('11-22-2021')
    );

    const notifications = validator.getNotifications();
    const notification = notifications[0];
    expect(notification.reference.endsWith('-21')).toBeTruthy();
    expect(notifications.length).toEqual(1);
  });

  type TwoDaySyncNotificationCases = [Date, string];

  const cases: TwoDaySyncNotificationCases[] = [
    [new Date('11-01-2021'), '-21'],
    [new Date('10-30-2021'), '-23'],
    [new Date('10-28-2021'), '-25'],
    [new Date('10-26-2021'), '-27'],
    [new Date('10-25-2021'), '-21'],
  ];

  test.each(cases)(
    'givin %lastSyncDate, return notification with reference ending with %referenceSuffix',
    (lastSyncDate, referenceSuffix) => {
      const validStore: RecursivePartial<EnhancedStore<RootState, any>> = {
        getState: () => ({
          settings: {
            lastDataSync: lastSyncDate,
          },
        }),
      };

      const validator = new UserLastLoginNotificationValidator(
        validStore as EnhancedStore<RootState, any>,
        new Date('11-22-2021')
      );

      const notifications = validator.getNotifications();
      const notification = notifications[0];
      expect(notification.reference.endsWith(referenceSuffix)).toBeTruthy();
    }
  );
});
