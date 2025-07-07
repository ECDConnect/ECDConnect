import { RecursivePartial, WorkflowStatusEnum } from '@ecdlink/core';
import { EnhancedStore } from '@reduxjs/toolkit';
import { RootState } from '@store/types';
import {
  NotificationIntervals,
  NotificationPriority,
} from '../../NotificationService.types';
import { ChildDocumentsNotificationValidator } from './childDocumentsNotificationValidator';

describe('childDocumentNotificationValidator', () => {
  test('should be able to create successfully', () => {
    const store: any = {};
    const validator = new ChildDocumentsNotificationValidator(store);

    expect(validator.interval).toEqual(NotificationIntervals.hour);
  });

  test('should return empty array when store is empty', () => {
    const store: RecursivePartial<EnhancedStore<RootState, any>> = {
      getState: () => ({}),
    };
    const validator = new ChildDocumentsNotificationValidator(
      store as EnhancedStore<RootState, any>
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
        documents: {
          documents: [
            {
              userCacheId: '1',
              workflowStatusId: WorkflowStatusEnum.ChildPending,
            },
            {
              userCacheId: '2',
              workflowStatusId: WorkflowStatusEnum.ChildPending,
            },
          ],
        },
      }),
    };
    const validator = new ChildDocumentsNotificationValidator(
      store as EnhancedStore<RootState, any>
    );
    const notifications = validator.getNotifications();
    expect(notifications.length).toEqual(2);
  });

  test('should return notifications when document status is pending-re-upload', () => {
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
        documents: {
          documents: [
            {
              userCacheId: '1',
              workflowStatusId: WorkflowStatusEnum.ChildPending,
            },
            {
              userCacheId: '2',
              workflowStatusId: WorkflowStatusEnum.DocumentVerified,
            },
          ],
        },
      }),
    };
    const validator = new ChildDocumentsNotificationValidator(
      store as EnhancedStore<RootState, any>
    );
    const notifications = validator.getNotifications();
    const hopeNotification = notifications.find(
      (x) => x.reference === `1-docs`
    );
    const derickNotification = notifications.find(
      (x) => x.reference === `2-docs`
    );

    expect(hopeNotification).toBeDefined();
    expect(derickNotification).toBeUndefined();
  });

  test('should only display on both the home screen an message page with higher priority', () => {
    const store: RecursivePartial<EnhancedStore<RootState, any>> = {
      getState: () => ({
        children: {
          children: [
            {
              cacheId: '1',
              userId: '1',
            },
          ],
          childUser: [
            {
              id: '1',
              firstName: 'Hope',
            },
          ],
        },
        documents: {
          documents: [
            {
              userCacheId: '1',
              workflowStatusId: WorkflowStatusEnum.ChildPending,
            },
          ],
        },
      }),
    };
    const validator = new ChildDocumentsNotificationValidator(
      store as EnhancedStore<RootState, any>
    );
    const notifications = validator.getNotifications();
    const hopeNotification = notifications.find(
      (x) => x.reference === `1-docs`
    );

    expect(hopeNotification?.priority).toEqual(NotificationPriority.higher);
    expect(hopeNotification?.viewType).toEqual('Both');
  });
});
