import { EnhancedStore } from '@reduxjs/toolkit';
import { getHours, getWeek, getYear, isFriday } from 'date-fns';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import { getMissedClassAttendance } from '@utils/classroom/attendance/track-attendance-utils';
import {
  NotificationIntervals,
  NotificationPriority,
  NotificationValidator,
} from '../../NotificationService.types';

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
      (role: { name: string }) => role.name === 'Coach'
    );

    if (isCoach) return [];

    if (!classroomState) return [];

    const hours = getHours(this.currentDate);

    // 12pm
    if (hours < 12) return [];

    const classroomGroups =
      classroomState?.classroomGroups?.filter(
        (classroomGroup) =>
          classroomGroup.isActive &&
          classroomGroup.userId === userState?.user?.id
      ) || [];

    if (!classroomGroups) return [];

    const isOnStipend = practitionerState?.practitioner?.isOnStipend;

    const missedAttendance = getMissedClassAttendance(
      classroomGroups || [],
      classroomState.classroomProgrammes || [],
      attendanceState.attendance || [],
      this.currentDate
    );

    if (!missedAttendance.length) return [];

    return [
      {
        reference: `attendance-${getWeek(this.currentDate)}-${getYear(
          this.currentDate
        )}`,
        title: "Today's attendance register is incomplete",
        message: `You have not submitted today's attendance register. Submit attendance registers daily ${
          isOnStipend && 'to receive your stipend'
        } and get SmartStart points.`,
        dateCreated: this.currentDate.toISOString(),
        priority: NotificationPriority.low,
        viewOnDashboard: true,
        area: 'tracking-attendance',
        icon: 'ExclamationCircleIcon',
        color: 'alertMain',
        actionText: 'See register',
        viewType: 'Both',
        routeConfig: {
          route: '/classroom',
          params: { activeTabIndex: 0 },
        },
      },
    ];
  };
}
