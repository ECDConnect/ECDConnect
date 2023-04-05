import { RecursivePartial } from '@ecdlink/core';
import { EnhancedStore } from '@reduxjs/toolkit';
import { setDate, setMonth } from 'date-fns';
import { RootState } from '@store/types';
import {
  NotificationIntervals,
  NotificationPriority,
} from '../../NotificationService.types';
import { ChildProgressReportNotificationValidator } from './childProgressReportNotificationValidator';

describe('childProgressReportNotificationValidator', () => {
  test('should be able to create successfully', () => {
    const store: any = {};
    const validator = new ChildProgressReportNotificationValidator(
      store,
      new Date()
    );

    expect(validator.interval).toEqual(NotificationIntervals.hour);
  });

  test('should return empty array when store is empty', () => {
    const store: RecursivePartial<EnhancedStore<RootState, any>> = {
      getState: () => ({}),
    };
    const validator = new ChildProgressReportNotificationValidator(
      store as EnhancedStore<RootState, any>,
      new Date()
    );
    const notifications = validator.getNotifications();
    expect(notifications).toEqual([]);
  });

  test('should return notifications with high priority and be visible on the dashboard and messages', () => {
    const store: RecursivePartial<EnhancedStore<RootState, any>> = {
      getState: () => ({
        children: {
          children: [
            {
              cacheId: '1',
              userId: '1',
            },
            {
              cacheId: '2',
              userId: '2',
            },
          ],
          childUser: [
            {
              userCacheId: '1',
              firstName: 'Hope',
            },
            {
              userCacheId: '2',
              firstName: 'Derick',
            },
          ],
        },
        contentReportData: {
          childProgressionReports: [
            {
              childCacheId: '1',
              reportingPeriod: 'December',
            },
          ],
        },
      }),
    };
    const validator = new ChildProgressReportNotificationValidator(
      store as EnhancedStore<RootState, any>,
      new Date('07-01-2021')
    );
    const notifications = validator.getNotifications();
    const notification = notifications[0];

    expect(notifications.length).toEqual(2);
    expect(notification.viewType).toEqual('Both');
    expect(notification.priority).toEqual(NotificationPriority.high);
  });

  type FinalReportingPeriodDay = [
    date: Date,
    expectedNumberOfNotifications: number
  ];

  const finalReportingPeriodDayCases: FinalReportingPeriodDay[] = [
    // First day of July
    [setDate(setMonth(new Date(), 6), 1), 2],
    // July final reporting date
    [setDate(setMonth(new Date(), 6), 31), 2],
    // Random day in July
    [setDate(setMonth(new Date(), 6), 9), 0],
    // December final reporting date
    [setDate(setMonth(new Date(), 11), 20), 2],
    // First day of December
    [setDate(setMonth(new Date(), 11), 1), 2],
    // Random day of December
    [setDate(setMonth(new Date(), 11), 14), 0],
    // Date in september
    [setDate(setMonth(new Date(), 8), 2), 0],
  ];

  test.each(finalReportingPeriodDayCases)(
    `givin %date, return %expectedNumberOfNotifications`,
    (date, expectedNumberOfNotifications) => {
      const store: RecursivePartial<EnhancedStore<RootState, any>> = {
        getState: () => ({
          children: {
            children: [
              {
                cacheId: '1',
                userId: '1',
              },
              {
                cacheId: '2',
                userId: '2',
              },
            ],
            childUser: [
              {
                id: '1',
                firstName: 'Hope',
              },
              {
                id: '2',
                firstName: 'Derick',
              },
            ],
          },
          contentReportData: {
            childProgressionReports: [
              {
                childCacheId: '1',
                reportingPeriod: 'December',
              },
              {
                childCacheId: '1',
                reportingPeriod: 'July',
              },
            ],
          },
        }),
      };

      const validator = new ChildProgressReportNotificationValidator(
        store as EnhancedStore<RootState, any>,
        date
      );

      const notifications = validator.getNotifications();

      expect(notifications.length).toEqual(expectedNumberOfNotifications);
    }
  );
});
