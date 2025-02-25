import { EnhancedStore } from '@reduxjs/toolkit';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import {
  NotificationIntervals,
  NotificationValidator,
} from '../../NotificationService.types';
import ROUTES from '@/routes/routes';
import {
  LocalStorageKeys,
  RoleSystemNameEnum,
  TenantType,
} from '@ecdlink/core';
import { differenceInDays } from 'date-fns';

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
      tenant: tenantState,
    } = this.store.getState();

    const principalClassroom = localStorage?.getItem(
      LocalStorageKeys?.classroomForInvitedUser
    );

    if (!classroomState || !userState) return [];

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

      const isOpenAccess =
        tenantState.tenant?.tenantType === TenantType.OpenAccess;
      const diffDays = differenceInDays(
        new Date(),
        new Date(practitionerState.practitioner?.startDate!)
      );
      const isTrialPeriod =
        isOpenAccess &&
        diffDays <= 30 &&
        !classroomState.classroom?.preschoolCode;

      const showNotificationForPractitionerFlow =
        (hasPractitionerRole || addedByPrincipal) &&
        practitionerState?.practitioner?.progress === 0;

      const showNotificationForPrincipalFlow =
        (hasPrincipalRole && notRegistered && !addedByPrincipal) ||
        (!addedByPrincipal &&
          practitionerState?.practitioner?.progress === 0) ||
        (practitionerState?.practitioner?.progress === 1.0 &&
          !addedByPrincipal) ||
        isTrialPeriod;

      if (showNotificationForPrincipalFlow) {
        return [
          {
            reference: `principal-profile`,
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
            isFromBackend: false,
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
                ? `Ask your principal to sign up for ${tenantState?.tenant?.applicationName} and add you to the preschool, or fill in your preschool code now.`
                : practitionerState?.practitioner?.principalHierarchy
                ? 'Connect with your principal & manage your classes.'
                : 'Set up your preschool or connect with your principal.',
            dateCreated: new Date().toISOString(),
            priority: 7,
            viewOnDashboard: true,
            isFromBackend: false,
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
