import { RecursivePartial } from '@ecdlink/core';
import { EnhancedStore } from '@reduxjs/toolkit';
import { getWeek, getYear, nextFriday, setHours } from 'date-fns';
import { RootState } from '@store/types';
import {
  NotificationIntervals,
  NotificationPriority,
} from '../../NotificationService.types';
import { IncompleteTrackAttendanceNotificationValidator } from './incompleteTrackAttendanceNotificationValidator';

describe('incompleteTrackAttendanceNotificationValidator', () => {
  test('should be able to create successfully', () => {
    const store: any = {};
    const validator = new IncompleteTrackAttendanceNotificationValidator(
      store,
      new Date()
    );

    expect(validator.interval).toEqual(NotificationIntervals.hour);
  });

  test('should return empty array when store is empty', () => {
    const store: RecursivePartial<EnhancedStore<RootState, any>> = {
      getState: () => ({}),
    };
    const validator = new IncompleteTrackAttendanceNotificationValidator(
      store as EnhancedStore<RootState, any>,
      new Date()
    );
    const notifications = validator.getNotifications();
    expect(notifications).toEqual([]);
  });

  test('should return notifications', () => {
    const store: RecursivePartial<EnhancedStore<RootState, any>> = {
      getState: () => ({
        classroomData: {
          classroomGroups: [
            {
              cacheId: '1',
            },
          ],
          classroomProgrammes: [
            {
              cacheId: '1',
              parentCacheId: '1',
              meetingDay: 1,
            },
          ],
        },
        attendanceData: {
          attendance: [
            {
              classProgrammeCacheId: '1',
            },
          ],
        },
      }),
    };
    const validator = new IncompleteTrackAttendanceNotificationValidator(
      store as EnhancedStore<RootState, any>,
      setHours(nextFriday(new Date().valueOf()), 16)
    );
    const notifications = validator.getNotifications();
    expect(notifications.length).toEqual(1);
  });

  test('should only create notification after 4pm on a friday', () => {
    const store: RecursivePartial<EnhancedStore<RootState, any>> = {
      getState: () => ({
        classroomData: {
          classroomGroups: [
            {
              cacheId: '1',
            },
          ],
          classroomProgrammes: [
            {
              cacheId: '1',
              parentCacheId: '1',
              meetingDay: 1,
            },
          ],
        },
        attendanceData: {
          attendance: [
            {
              classProgrammeCacheId: '1',
            },
          ],
        },
      }),
    };
    let date = setHours(nextFriday(new Date().valueOf()), 16);
    let invalidDate = setHours(nextFriday(new Date().valueOf()), 14);

    const validator = new IncompleteTrackAttendanceNotificationValidator(
      store as EnhancedStore<RootState, any>,
      date
    );

    const invalidValidator = new IncompleteTrackAttendanceNotificationValidator(
      store as EnhancedStore<RootState, any>,
      invalidDate
    );

    const notifications = validator.getNotifications();
    const invalidNotification = invalidValidator.getNotifications();

    expect(notifications.length).toEqual(1);
    expect(invalidNotification.length).toEqual(0);
  });

  test('should only display on both the home screen an message page with a low priority', () => {
    const store: RecursivePartial<EnhancedStore<RootState, any>> = {
      getState: () => ({
        classroomData: {
          classroomGroups: [
            {
              cacheId: '1',
            },
          ],
          classroomProgrammes: [
            {
              cacheId: '1',
              parentCacheId: '1',
              meetingDay: 1,
            },
          ],
        },
        attendanceData: {
          attendance: [
            {
              classProgrammeCacheId: '1',
            },
          ],
        },
      }),
    };
    const currentDate = setHours(nextFriday(new Date().valueOf()), 16);
    const validator = new IncompleteTrackAttendanceNotificationValidator(
      store as EnhancedStore<RootState, any>,
      currentDate
    );
    const notifications = validator.getNotifications();
    const n = notifications.find(
      (x) =>
        x.reference ===
        `attendance-${getWeek(currentDate)}-${getYear(currentDate)}`
    );
    expect(n?.viewType).toEqual('Both');
    expect(n?.priority).toEqual(NotificationPriority.low);
  });
});
