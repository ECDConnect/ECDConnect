import { RecursivePartial } from '@ecdlink/core';
import { EnhancedStore } from '@reduxjs/toolkit';
import { subDays } from 'date-fns';
import { RootState } from '@store/types';
import {
  NotificationIntervals,
  NotificationPriority,
} from '../../NotificationService.types';
import { IncompleteChildRegistrationNotificationValidator } from './incompleteChildRegistrationNotificationValidator';

describe('incompleteChildRegistrationNotificationValidator', () => {
  test('should be able to create successfully', () => {
    const store: any = {};
    const validator = new IncompleteChildRegistrationNotificationValidator(
      store,
      new Date()
    );

    expect(validator.interval).toEqual(NotificationIntervals.hour);
  });

  test('should return empty array when store is empty', () => {
    const store: RecursivePartial<EnhancedStore<RootState, any>> = {
      getState: () => ({}),
    };
    const validator = new IncompleteChildRegistrationNotificationValidator(
      store as EnhancedStore<RootState, any>,
      new Date()
    );
    const notifications = validator.getNotifications();
    expect(notifications).toEqual([]);
  });

  test('should return notifications', () => {
    const store: RecursivePartial<EnhancedStore<RootState, any>> = {
      getState: () => ({
        children: {
          children: [
            {
              childStatusId: 6,
              cacheCaregiverId: '1',
              createdDate: '06-12-2021',
              cacheId: '1',
            },
            {
              childStatusId: 1,
              createdDate: '08-12-2021',
              cacheId: '2',
            },
          ],
          childUser: [
            {
              userCacheId: '1',
              firstName: 'Derick',
            },
            {
              userCacheId: '2',
              firstName: 'Hope',
            },
          ],
        },
      }),
    };
    const validator = new IncompleteChildRegistrationNotificationValidator(
      store as EnhancedStore<RootState, any>,
      new Date()
    );
    const notifications = validator.getNotifications();
    expect(notifications.length).toEqual(2);
  });

  test('should only surface 20 days after child has been registered', () => {
    const store: RecursivePartial<EnhancedStore<RootState, any>> = {
      getState: () => ({
        children: {
          children: [
            {
              childStatusId: 6,
              createdDate: subDays(new Date(), 20),
              cacheId: '1',
            },
            {
              childStatusId: 6,
              createdDate: new Date(),
              cacheId: '2',
            },
          ],
          childUser: [
            {
              userCacheId: '1',
              firstName: 'Derick',
            },
            {
              userCacheId: '2',
              firstName: 'Hope',
            },
          ],
        },
      }),
    };
    const validator = new IncompleteChildRegistrationNotificationValidator(
      store as EnhancedStore<RootState, any>,
      new Date()
    );
    const notifications = validator.getNotifications();
    const derickNotification = notifications.find(
      (x) => x.reference === `1-reg`
    );
    const hopeNotification = notifications.find((x) => x.reference === `2-reg`);

    expect(notifications.length).toEqual(1);
    expect(derickNotification).toBeDefined();
    expect(hopeNotification).toBeUndefined();
  });

  test('should only display on both the home screen an message page with lowest priority', () => {
    const store: RecursivePartial<EnhancedStore<RootState, any>> = {
      getState: () => ({
        children: {
          children: [
            {
              childStatusId: 6,
              createdDate: subDays(new Date(), 20),
              cacheId: '1',
            },
            {
              childStatusId: 6,
              createdDate: new Date(),
              cacheId: '2',
            },
          ],
          childUser: [
            {
              userCacheId: '1',
              firstName: 'Derick',
            },
            {
              userCacheId: '2',
              firstName: 'Hope',
            },
          ],
        },
      }),
    };
    const validator = new IncompleteChildRegistrationNotificationValidator(
      store as EnhancedStore<RootState, any>,
      new Date()
    );

    const notifications = validator.getNotifications();
    const derickNotification = notifications.find(
      (x) => x.reference === `1-reg`
    );

    expect(derickNotification?.viewType).toEqual('Both');
    expect(derickNotification?.priority).toEqual(NotificationPriority.lowest);
  });
});
