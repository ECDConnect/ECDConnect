import { WorkflowStatusEnum } from '@ecdlink/graphql';
import { EnhancedStore } from '@reduxjs/toolkit';
import { differenceInCalendarDays } from 'date-fns';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import {
  NotificationValidator,
  NotificationIntervals,
} from '../../NotificationService.types';
import { RoleSystemNameEnum } from '@ecdlink/core';

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
    const incompleteChildren = (childrenState.children || []).filter(
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
      const childUser = childrenState.childUser?.find(
        (childUser) => childUser.id === child.userId
      );

      if (!childUser) continue;

      // if (!isCoach) {
      //   notifications.push({
      //     reference: `${child.id || childUser?.firstName}-reg`,
      //     title: `${childUser?.firstName}'s registration incomplete`,
      //     message: `If you do not complete ${
      //       childUser?.firstName
      //     }'s registration form, ${
      //       childUser?.firstName
      //     }'s profile will be removed on ${addDays(
      //       new Date(child.insertedDate || 0),
      //       20
      //     ).toLocaleString('en-za', DateFormats.dayWithShortMonthName)}`,
      //     dateCreated: new Date().toISOString(),
      //     priority: NotificationPriority.lowest,
      //     viewOnDashboard: true,
      //     area: 'child-registration',
      //     icon: 'XCircleIcon',
      //     color: 'errorMain',
      //     viewType: 'Both',
      //     actionText: 'Finish registration',
      //     routeConfig: {
      //       route: '/child-registration',
      //       params: {
      //         step: 6,
      //         childId: child.id,
      //       },
      //     },
      //   });
      // } else {
      //   return [];
      // }
    }

    return notifications;
  };
}
