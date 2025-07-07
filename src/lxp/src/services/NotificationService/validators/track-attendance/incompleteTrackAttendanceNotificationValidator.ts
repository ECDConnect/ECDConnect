import { EnhancedStore } from '@reduxjs/toolkit';
import { getHours, getWeek, getYear } from 'date-fns';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import { getMissedClassAttendance } from '@utils/classroom/attendance/track-attendance-utils';
import {
  NotificationIntervals,
  NotificationPriority,
  NotificationValidator,
} from '../../NotificationService.types';
import { RoleSystemNameEnum } from '@ecdlink/core';
import { useTenant } from '@/hooks/useTenant';

export class IncompleteTrackAttendanceNotificationValidator
  implements NotificationValidator
{
  interval: NotificationIntervals;
  lastCheckTimestamp: number;
  store: EnhancedStore<RootState, any>;
  currentDate: Date;

  constructor(store: EnhancedStore<RootState, any>, currentDate: Date) {
    this.store = store;
    this.interval = NotificationIntervals.halfhour;
    this.lastCheckTimestamp = 0;
    this.currentDate = currentDate;
  }

  getNotifications = (): Message[] => {
    const {
      classroomData: classroomState,
      attendanceData: attendanceState,
      practitioner: practitionerState,
      user: userState,
    } = this.store.getState();

    const isCoach = userState?.user?.roles?.some(
      (role: { systemName: string }) =>
        role.systemName === RoleSystemNameEnum.Coach
    );

    if (isCoach) return [];
    if (!classroomState) return [];

    const hours = getHours(this.currentDate);
    const lastFridayOfMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0
    );
    if (lastFridayOfMonth.getDay() < 5) {
      lastFridayOfMonth.setDate(lastFridayOfMonth.getDate() - 7);
    }
    lastFridayOfMonth.setDate(
      lastFridayOfMonth.getDate() - (lastFridayOfMonth.getDay() - 5)
    );
    lastFridayOfMonth.setHours(0, 0, 0, 0);

    if (this.currentDate.getDate() <= lastFridayOfMonth.getDate()) {
      return [];
    }
    // 4pm
    if (hours < 16) return [];

    const classroomGroups =
      classroomState.classroomGroupData.classroomGroups.filter(
        (classroomGroup) => classroomGroup.userId === userState?.user?.id
      ) || [];

    if (!classroomGroups) return [];

    const missedAttendance = getMissedClassAttendance(
      classroomGroups || [],
      classroomGroups
        .flatMap((x) => x.classProgrammes)
        .filter((x) => x.isActive),
      attendanceState.attendance || [],
      this.currentDate
    );

    if (!missedAttendance.length) return [];

    const tenant = useTenant();
    return [
      {
        reference: `attendance-${getWeek(this.currentDate)}-${getYear(
          this.currentDate
        )}`,
        title: 'Save your attendance registers!',
        message: `More and more practitioners are saving their attendance registers on ${tenant.tenant?.applicationName} - join them and save yours!`,
        dateCreated: this.currentDate.toISOString(),
        priority: NotificationPriority.highest,
        viewOnDashboard: true,
        isFromBackend: false,
        area: 'tracking-attendance',
        icon: 'ExclamationCircleIcon',
        color: 'alertMain',
        actionText: 'See registers',
        viewType: 'Both',
        routeConfig: {
          route: '/classroom',
          params: { activeTabIndex: 0 },
        },
      },
    ];
  };
}
