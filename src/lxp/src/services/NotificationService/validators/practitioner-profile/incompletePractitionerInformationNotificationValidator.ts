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
import { format } from 'date-fns';

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
    } = this.store.getState();

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
        (role) => role.name === 'Practitioner'
      );

      const hasPrincipalRole = userState?.user?.roles?.some(
        (role) => role.name === 'Principal'
      );

      const notRegistered = !Boolean(
        practitionerState.practitioner?.isRegistered
      );
      const addedByPrincipal =
        Boolean(practitionerState.practitioner?.principalHierarchy) &&
        !practitionerState.practitioner?.isPrincipal;

      const showNotificationForPractitionerFlow =
        (hasPractitionerRole || addedByPrincipal) &&
        notRegistered &&
        practitionerState?.practitioner?.progress === 0;
      const showNotificationForPrincipalFlow =
        (hasPrincipalRole && notRegistered && !addedByPrincipal) ||
        (!addedByPrincipal && practitionerState?.practitioner?.progress === 0);
      const isTrainee = practitionerState?.practitioner?.isTrainee;

      if (isTrainee) {
        const timeline = traineeState?.traineeOnboardTimeline;
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
          const overdueDate = overdueSteps[0].extraData?.date || new Date();
          return [
            {
              reference: `trainee-profile`,
              title: 'Onboarding tasks overdue',
              message: `You have overdue onboarding tasks. Tasks were due by ${format(
                overdueDate,
                'd MMM yyyy'
              )}. If you do not complete these tasks, your coach will be asked to remove you from the programme.`,
              dateCreated: new Date().toISOString(),
              priority: NotificationPriority.highest,
              viewOnDashboard: true,
              area: 'practitioner',
              icon: 'SwitchVerticalIcon',
              color: 'primary',
              actionText: 'See onboarding tasks',
              viewType: 'Hub',
              routeConfig: {
                route: ROUTES.TRAINEE.TRAINEE_ONBOARDING,
              },
            },
          ];
        }

        if (
          (isOnStipend && completedSteps?.length < 8) ||
          (!isOnStipend && completedSteps?.length < 7)
        ) {
          return [
            {
              reference: `trainee-profile`,
              title: 'Start your trainee journey!',
              message:
                'Sign your franchisee & start-up support agreements, start registering children, and make sure your venue meets the SmartSpace standards.',
              dateCreated: new Date().toISOString(),
              priority: NotificationPriority.highest,
              viewOnDashboard: true,
              area: 'practitioner',
              icon: 'SwitchVerticalIcon',
              color: 'primary',
              actionText: 'Get started',
              viewType: 'Hub',
              routeConfig: {
                route: ROUTES.TRAINEE.SETUP_TRAINEE,
              },
            },
          ];
        }
      }

      if (showNotificationForPrincipalFlow) {
        return [
          {
            reference: `practitioner-profile`,
            title: 'Tell us more about you!',
            message:
              'Share more information about your programme to make Funda App useful for you.',
            dateCreated: new Date().toISOString(),
            priority: NotificationPriority.highest,
            viewOnDashboard: true,
            area: 'practitioner',
            icon: 'SwitchVerticalIcon',
            color: 'primary',
            actionText: 'Complete your profile',
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
            title: 'Tell us more about you!',
            message:
              'Share more information about your programme to make Funda App useful for you.',
            dateCreated: new Date().toISOString(),
            priority: NotificationPriority.lower,
            viewOnDashboard: true,
            area: 'practitioner',
            icon: 'SwitchVerticalIcon',
            color: 'primary',
            actionText: 'Complete your profile',
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
