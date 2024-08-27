import { WorkflowStatusEnum } from '@ecdlink/graphql';
import { EnhancedStore } from '@reduxjs/toolkit';
import { addDays, differenceInCalendarDays } from 'date-fns';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import {
  NotificationValidator,
  NotificationIntervals,
  NotificationPriority,
} from '../../NotificationService.types';
import { RoleSystemNameEnum } from '@ecdlink/core';
import { DateFormats } from '@/constants/Dates';

export class IncompleteChildRegistrationNotificationValidator
  implements NotificationValidator
{
  interval: NotificationIntervals;
  lastCheckTimestamp: number;
  store: EnhancedStore<RootState, any>;
  currentDate: Date;
  constructor(store: EnhancedStore<RootState, any>, currentDate: Date) {
    this.store = store;
    this.interval = NotificationIntervals.hour;
    this.lastCheckTimestamp = 0;
    this.currentDate = currentDate;
  }

  getNotifications = (): Message[] => {
    const {
      children: childrenState,
      staticData: staticDataState,
      user: userState,
    } = this.store.getState();

    const isCoach = userState?.user?.roles?.some(
      (role) => role.systemName === RoleSystemNameEnum.Coach
    );

    if (isCoach) return [];

    if (!childrenState || !staticDataState) return [];

    const workflowStatus = staticDataState.WorkflowStatuses?.find(
      (x) => x.enumId === WorkflowStatusEnum.ChildPending
    );
    const notifications: Message[] = [];
    const incompleteChildren = childrenState.childData.children.filter(
      (child) =>
        child.workflowStatusId === workflowStatus?.id || !child?.caregiverId
    );

    const applicableChildren = incompleteChildren.filter(
      (child) =>
        Math.abs(
          differenceInCalendarDays(
            this.currentDate,
            new Date(child.insertedDate || this.currentDate)
          )
        ) >= 20
    );

    if (!applicableChildren) return [];

    for (const child of applicableChildren) {
      if (!isCoach) {
        notifications.push({
          reference: `${child.id || child.user?.firstName}-reg`,
          title: `${child.user?.firstName}'s registration incomplete`,
          message: `If you do not complete ${
            child.user?.firstName
          }'s registration form, ${
            child.user?.firstName
          }'s profile will be removed on ${addDays(
            new Date(child.insertedDate || 0),
            20
          ).toLocaleString('en-za', DateFormats.dayWithShortMonthName)}`,
          dateCreated: new Date().toISOString(),
          priority: NotificationPriority.lowest,
          viewOnDashboard: true,
          area: 'child-registration',
          icon: 'XCircleIcon',
          color: 'errorMain',
          viewType: 'Both',
          actionText: 'Finish registration',
          routeConfig: {
            route: '/child-registration',
            params: {
              step: 6,
              childId: child.id,
            },
          },
        });
      } else {
        return [];
      }
    }

    return notifications;
  };
}
