import { EnhancedStore } from '@reduxjs/toolkit';
import { getDate, getMonth, getYear } from 'date-fns';
import { Message } from '../../../../models/messages/messages';
import { RootState } from '@store/types';
import {
  NotificationPriority,
  NotificationValidator,
  NotificationIntervals,
} from '../../NotificationService.types';

export class ChildProgressReportNotificationValidator implements NotificationValidator {
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

  private isLastDateOfReportingPeriod = (reportingPeriod: string) => {
    switch (reportingPeriod) {
      case 'July':
        return getDate(this.currentDate) === 31;
      case 'December':
        return getDate(this.currentDate) === 20;
    }
  };

  getNotifications = (): Message[] => {
    const { children: childrenState, contentReportData: contentReportState } =
      this.store.getState();

    if (!childrenState || !contentReportState) return [];
    const monthOfDate = getMonth(this.currentDate);

    if (monthOfDate !== 6 && monthOfDate !== 11) return [];

    const reportingPeriod = monthOfDate === 6 ? 'July' : 'December';

    // only create notifications on the first or final day of the last month of the reporting period
    if (getDate(this.currentDate) > 1 && !this.isLastDateOfReportingPeriod(reportingPeriod))
      return [];

    const notifications: Message[] = [];
    for (const child of childrenState.children || []) {
      const childProgressReport = (contentReportState.childProgressionReports || []).find(
        (report) => report.childId === child.id && report.reportingPeriod === reportingPeriod
      );

      if (childProgressReport && childProgressReport.dateCompleted) continue;

      const childUser = childrenState.childUser?.find((x) => x.id === child.userId);

      notifications.push({
        reference: `${child.id || childUser?.firstName}-${reportingPeriod}-${getYear(
          this.currentDate
        )}${this.isLastDateOfReportingPeriod(reportingPeriod) ? '-lw' : ''}`, // append '-lw' if it's the final day of reporting period.
        title: `${childUser?.firstName}'s progress report is incomplete'`,
        message: `Create a progress report for ${childUser?.firstName} to share with caregivers. Remember to remove any children who are no longer attending your programme`,
        priority: NotificationPriority.high,
        actionText: 'Finish reports',
        area: 'progress-report',
        color: 'primary',
        dateCreated: new Date().toISOString(),
        icon: 'IdentificationIcon',
        viewOnDashboard: true,
        viewType: 'Both',
        routeConfig: {
          route: '/child-progress-observation',
          params: {
            childId: child.id,
          },
        },
      });
    }

    return notifications;
  };
}
