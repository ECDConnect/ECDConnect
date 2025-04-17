import { WorkflowStatusEnum } from '@ecdlink/graphql';
import { EnhancedStore } from '@reduxjs/toolkit';
import { addDays, differenceInCalendarDays } from 'date-fns';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import {
  NotificationValidator,
  NotificationIntervals,
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
      practitioner: practitionerState,
    } = this.store.getState();

    const isCoach = userState?.user?.roles?.some(
      (role) => role.systemName === RoleSystemNameEnum.Coach
    );

    if (isCoach) return [];

    if (!childrenState || !staticDataState) return [];

    const isPrincipal = practitionerState.practitioner?.isPrincipal;

    const workflowStatus = staticDataState.WorkflowStatuses?.find(
      (x) => x.enumId === WorkflowStatusEnum.ChildPending
    );
    const notifications: Message[] = [];
    const incompleteChildren = childrenState.childData.children.filter(
      (child) =>
        child.workflowStatusId === workflowStatus?.id || !child?.caregiverId
    );

    const applicableChildren = isPrincipal
      ? incompleteChildren.filter(
          (child) =>
            Math.abs(
              differenceInCalendarDays(
                this.currentDate,
                new Date(child.insertedDate || this.currentDate)
              )
            ) >= 20
        )
      : incompleteChildren.filter(
          (child) =>
            child.insertedBy === userState.user?.id &&
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
            30
          ).toLocaleString('en-za', DateFormats.dayWithShortMonthName)}`,
          dateCreated: new Date().toISOString(),
          priority: 18,
          viewOnDashboard: true,
          isFromBackend: false,
          area: 'child-registration',
          icon: 'XCircleIcon',
          color: 'errorMain',
          viewType: 'Both',
          actionText: 'Finish registration',
          routeConfig: {
            route: '/child-profile',
            params: {
              // step: 2,
              childId: child.id,
              notificationReference: `${child.id || child.user?.firstName}-reg`,
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
