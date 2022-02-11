import { EnhancedStore } from '@reduxjs/toolkit';
import { getHours, getWeek, getYear, isFriday } from 'date-fns';
import { Message } from '../../../../models/messages/messages';
import { RootState } from '../../../../store/types';
import { getMissedClassAttendance } from '../../../../utils/classroom/attendance/track-attendance-utils';
import {
  NotificationIntervals,
  NotificationPriority,
  NotificationValidator,
} from '../../NotificationService.types';

export class IncompleteTrackAttendanceNotificationValidator implements NotificationValidator {
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
    const { classroomData: classroomState, attendanceData: attendanceState } =
      this.store.getState();

    if (!classroomState) return [];

    if (!isFriday(this.currentDate)) return [];

    const hours = getHours(this.currentDate);

    // 4pm
    if (hours < 16) return [];

    const missedAttendance = getMissedClassAttendance(
      classroomState.classroomGroups || [],
      classroomState.classroomProgrammes || [],
      attendanceState.attendance || [],
      this.currentDate
    );

    if (!missedAttendance) return [];

    return [
      {
        reference: `attendance-${getWeek(this.currentDate)}-${getYear(this.currentDate)}`,
        title: '2 days left to submit attendance registers',
        message:
          'Submit all of your registers for this week to receive your stipend and get SmartStart points.',
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
