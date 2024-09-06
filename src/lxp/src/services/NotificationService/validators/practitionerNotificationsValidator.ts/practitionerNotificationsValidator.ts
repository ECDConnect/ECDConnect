import { EnhancedStore } from '@reduxjs/toolkit';
import { differenceInDays, lastDayOfMonth } from 'date-fns';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import {
  NotificationValidator,
  NotificationIntervals,
  NotificationPriority,
} from '../../NotificationService.types';
import { RoleSystemNameEnum } from '@ecdlink/core';
import ROUTES from '@/routes/routes';

export class PractitionerNotificationValidator
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
      user: userState,
      practitioner: practitionerState,
      tenant: tenantState,
      classroomData: classroomState,
      community: communityState,
    } = this.store.getState();

    const isCoach = userState?.user?.roles?.some(
      (role) => role.systemName === RoleSystemNameEnum.Coach
    );

    if (isCoach) return [];

    const notifications: Message[] = [];

    const year = new Date().getFullYear();
    const checkLocationDate = new Date(year, 2, 1);
    const today = new Date();
    const checkLocationDateLessThan15Days =
      differenceInDays(new Date(), checkLocationDate) < 15;

    const isMoreThan30Days =
      differenceInDays(
        new Date(),
        new Date(practitionerState?.practitioner?.startDate!)
      ) > 30;
    const isLessThan45Days =
      differenceInDays(
        new Date(),
        new Date(practitionerState?.practitioner?.startDate!)
      ) < 45;

    if (
      (isMoreThan30Days &&
        isLessThan45Days &&
        !classroomState?.classroom?.siteAddress) ||
      (today === checkLocationDate &&
        !classroomState?.classroom?.siteAddress &&
        checkLocationDateLessThan15Days)
    ) {
      notifications.push({
        reference: `practitioner-profile-no-preschool-location`,
        title: `Add your preschool location!`,
        message: `You can add your preschool location to ${tenantState?.tenant?.applicationName}.`,
        dateCreated: new Date().toISOString(),
        priority: NotificationPriority.average,
        viewOnDashboard: true,
        area: 'practitioner',
        icon: 'InformationCircleIcon',
        color: 'infoMain',
        actionText: 'Add location',
        viewType: 'Both',
        routeConfig: {
          route: ROUTES.PRACTITIONER.PROGRAMME_INFORMATION,
        },
      });
    }

    if (
      !practitionerState?.practitioner?.user?.phoneNumber &&
      practitionerState?.practitioner?.isRegistered
    ) {
      notifications?.push({
        reference: `practitioner-profile-no-cellphone-number`,
        title: `Add your cellphone number!`,
        message: `Add your cellphone number to stay connected.`,
        dateCreated: new Date().toISOString(),
        priority: NotificationPriority.high,
        viewOnDashboard: true,
        area: 'practitioner',
        icon: 'ExclamationIcon',
        color: 'alertMain',
        actionText: 'Add number',
        viewType: 'Both',
        routeConfig: {
          route: ROUTES.PRACTITIONER.ABOUT.ROOT,
        },
      });
    }

    if (!isMoreThan30Days && !communityState?.communityProfile) {
      notifications.push({
        reference: `practitioner-no-community-profile`,
        title: `Join the communty!`,
        message: `Did you know you can connect with other ECD Heroes on ${tenantState?.tenant?.applicationName}.`,
        dateCreated: new Date().toISOString(),
        priority: NotificationPriority.average,
        viewOnDashboard: true,
        area: 'practitioner',
        icon: 'InformationCircleIcon',
        color: 'infoMain',
        actionText: 'Get started',
        viewType: 'Both',
        routeConfig: {
          route: ROUTES.PRACTITIONER.COMMUNITY.WELCOME,
        },
      });
    }

    return notifications;
  };
}
