import { WorkflowStatusEnum } from '@ecdlink/graphql';
import { EnhancedStore } from '@reduxjs/toolkit';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import {
  NotificationIntervals,
  NotificationPriority,
  NotificationValidator,
} from '../../NotificationService.types';
export class ChildDocumentsNotificationValidator
  implements NotificationValidator
{
  interval: NotificationIntervals;
  lastCheckTimestamp: number;
  store: EnhancedStore<RootState, any>;

  constructor(store: EnhancedStore<RootState, any>) {
    this.store = store;
    this.interval = NotificationIntervals.hour;
    this.lastCheckTimestamp = 0;
  }

  getNotifications = () => {
    const state = this.store.getState();

    const {
      documents: documentsState,
      children: childrenState,
      staticData: staticDataState,
      classroomData: classroomDataState,
      practitioner: practitionerState,
    } = state;

    if (!documentsState || !childrenState || !staticDataState) return [];

    const hasPrincipalRole = practitionerState?.practitioner?.isPrincipal;

    const notifications: Message[] = [];
    const workflowStatus = staticDataState.WorkflowStatuses?.find(
      (x) => x.enumId === WorkflowStatusEnum.ChildPending
    );
    for (const child of childrenState.childData.children) {
      const childDocuments = (documentsState.documents || []).filter(
        (doc) => doc.userId === child.userId
      );

      if (
        childDocuments.some(
          (doc) => doc.workflowStatusId === workflowStatus?.id
        )
      ) {
        notifications.push({
          reference: `${child.id || child.user?.idNumber}-docs`,
          title: `Problem with ${child.user?.firstName}'s document`,
          message: `There was a problem with ${child.user?.firstName}'s birth certificate or clinic card. Add a new one.`,
          dateCreated: new Date().toISOString(),
          priority: NotificationPriority.higher,
          viewOnDashboard: true,
          area: 'child-registration',
          icon: 'IdentificationIcon',
          color: 'primary',
          actionText: 'Upload',
          viewType: 'Both',
          routeConfig: {
            route: '/child-profile',
            params: {
              childId: child.id,
            },
          },
        });
      } else {
        if (hasPrincipalRole && child.caregiverId) {
          const groups =
            classroomDataState?.classroomGroupData?.classroomGroups?.find(
              (group) =>
                group.learners?.some(
                  (learner) =>
                    learner.childUserId === child.userId && learner.isActive
                )
            );
          if (!groups) {
            notifications.push({
              reference: `${child.id || child.user?.idNumber}-class`,
              title: `Assign ${child.user?.firstName} to a class`,
              message: `${child.user?.firstName} is not assigned to a class`,
              dateCreated: new Date().toISOString(),
              priority: NotificationPriority.higher,
              viewOnDashboard: true,
              area: 'child-registration',
              icon: 'IdentificationIcon',
              color: 'primary',
              actionText: 'Add to a class',
              cta: '[[AddChildToClass]]',
              action: child.id,
              viewType: 'Both',
              routeConfig: {
                route: '/child-profile',
                params: {
                  childId: child.id,
                },
              },
            });
          }
        }
      }
    }

    return notifications;
  };
}
