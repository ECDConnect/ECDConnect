import { EnhancedStore } from '@reduxjs/toolkit';
import { StepItem } from '@ecdlink/ui';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import {
  NotificationIntervals,
  NotificationPriority,
  NotificationValidator,
} from '../../NotificationService.types';
import ROUTES from '@/routes/routes';
import { timelineSteps } from '@/pages/trainee/trainee-onboarding/components/trainee-onboarding-dashboard/timeline-steps';
import { LocalStorageKeys, RoleSystemNameEnum } from '@ecdlink/core';

export class IncompletePractitionerInformationNotificationValidator
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

  getNotifications = (): Message[] => {
    const {
      user: userState,
      classroomData: classroomState,
      practitioner: practitionerState,
      trainee: traineeState,
      tenant: tenantState,
    } = this.store.getState();

    const principalClassroom = localStorage?.getItem(
      LocalStorageKeys?.classroomForInvitedUser
    );

    if (!classroomState || !userState) return [];
    const isOnStipend = practitionerState?.practitioner?.isOnStipend;

    /**
     * Notification is returned when
     * 1. The user is a practitioner
     * 2. The practitioner object is in the state
     * 3. The practitioner is not a principal yet
     */

    // TODO: change conditions for when to show the page

    if (practitionerState.practitioner) {
      const hasPractitionerRole = userState?.user?.roles?.some(
        (role) => role.systemName === RoleSystemNameEnum.Practitioner
      );

      const hasPrincipalRole = userState?.user?.roles?.some(
        (role) => role.systemName === RoleSystemNameEnum.Principal
      );

      const notRegistered = !Boolean(
        practitionerState.practitioner?.isRegistered
      );
      const addedByPrincipal =
        Boolean(practitionerState.practitioner?.principalHierarchy) &&
        !practitionerState.practitioner?.isPrincipal;

      const showNotificationForPractitionerFlow =
        (hasPractitionerRole || addedByPrincipal) &&
        practitionerState?.practitioner?.progress === 0;
      const showNotificationForPrincipalFlow =
        (hasPrincipalRole && notRegistered && !addedByPrincipal) ||
        (!addedByPrincipal &&
          practitionerState?.practitioner?.progress === 0) ||
        (practitionerState?.practitioner?.progress === 1.0 &&
          !addedByPrincipal) ||
        (practitionerState?.practitioner?.progress === 2 &&
          !addedByPrincipal &&
          !classroomState?.classroom?.name);
      const isTrainee = practitionerState?.practitioner?.isTrainee;

      if (isTrainee) {
        const timeline =
          traineeState?.traineeOnboardTimeline[
            practitionerState.practitioner.userId || ''
          ];
        const steps = timelineSteps(
          timeline!,
          () => {},
          false,
          true,
          // @ts-ignore
          undefined,
          '',
          timeline?.consolidationMeetingStatus,
          isOnStipend
        );

        const completedSteps = steps.filter(
          (item) => item?.type === 'completed'
        );
        const overdueSteps = steps
          .filter((item) => {
            const overdueDate = (item as StepItem<{ date: Date }>)?.extraData
              ?.date;
            return (
              (item?.type === 'todo' || item?.type === 'inProgress') &&
              overdueDate &&
              overdueDate < new Date()
            );
          })
          .sort(
            (stepA, stepB) =>
              ((stepA as StepItem<{ date: Date }>).extraData?.date?.getTime() ||
                0) -
              ((stepB as StepItem<{ date: Date }>).extraData?.date?.getTime() ||
                0)
          ) as StepItem<{ date: Date }>[];

        if (overdueSteps?.length > 0) {
          return [];
        }

        if (
          (isOnStipend && completedSteps?.length < 8) ||
          (!isOnStipend && completedSteps?.length < 7)
        ) {
          return [];
        }
      }

      if (showNotificationForPrincipalFlow) {
        return [
          {
            reference: `practitioner-profile`,
            // Check if user skip the link to a principal step
            title:
              practitionerState?.practitioner?.progress === 1.0
                ? 'Join your preschool team!'
                : 'Join or add a preschool!',
            message:
              practitionerState?.practitioner?.progress === 1.0
                ? `Ask your principal to sign up for ${tenantState?.tenant?.applicationName} and add you to the preschool, or fill in your preschool code now.`
                : 'Set up your preschool or connect with your principal.',
            dateCreated: new Date().toISOString(),
            priority: 6,
            viewOnDashboard: true,
            area: 'practitioner',
            icon: 'SwitchVerticalIcon',
            color: 'primary',
            actionText: 'Get started',
            viewType: 'Hub',
            routeConfig: {
              route: ROUTES.PRINCIPAL.SETUP_PROFILE,
            },
          },
        ];
      }

      if (showNotificationForPractitionerFlow) {
        return [
          {
            reference: `practitioner-profile`,
            title:
              practitionerState?.practitioner?.progress === 1.0
                ? 'Join your preschool team!'
                : practitionerState?.practitioner?.principalHierarchy
                ? `You have been added to ${
                    classroomState?.classroom?.name
                      ? classroomState?.classroom?.name
                      : principalClassroom
                  }`
                : 'Join or add a preschool!',
            message:
              practitionerState?.practitioner?.progress === 1.0
                ? 'Ask your principal to sign up for AppName and add you to the preschool, or fill in your preschool code now.'
                : practitionerState?.practitioner?.principalHierarchy
                ? 'Connect with your principal & manage your classes.'
                : 'Set up your preschool or connect with your principal.',
            dateCreated: new Date().toISOString(),
            priority: 7,
            viewOnDashboard: true,
            area: 'practitioner',
            icon: 'SwitchVerticalIcon',
            color: 'primary',
            actionText: 'Get started',
            viewType: 'Hub',
            routeConfig: {
              route: ROUTES.PRACTITIONER.PROFILE.EDIT,
            },
          },
        ];
      }
    }

    return [];
  };
}
