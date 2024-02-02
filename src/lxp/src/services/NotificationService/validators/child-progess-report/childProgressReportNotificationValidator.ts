import { EnhancedStore } from '@reduxjs/toolkit';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import {
  NotificationPriority,
  NotificationValidator,
  NotificationIntervals,
} from '../../NotificationService.types';
import { ChildDto, ChildProgressReportSummaryModel } from '@ecdlink/core';
import { addMonths } from 'date-fns';

type ReportingPeriodType = {
  period: string;
  year: number;
  startDate: Date;
  endDate: Date;
  deadlineDate: Date;
  threeMonthsDate: Date;
};

type ChildReportType = {
  child: ChildDto;
  report: ChildProgressReportSummaryModel | undefined;
};

export class ChildProgressReportNotificationValidator
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

  private getReportingPeriod = () => {
    const month = new Date().getMonth();
    if (month > 2 && month <= 8) return 'June';
    return 'November';
  };

  private getReportingPeriodDates = (reportingPeriod: string) => {
    const year = new Date().getFullYear();
    switch (reportingPeriod) {
      case 'June':
        return {
          year,
          startDate: new Date(year, 5, 1),
          endDate: new Date(year, 5, 30),
          deadlineDate: new Date(year, 6, 31),
          threeMonthsDate: new Date(year, 7, 31),
        };
      case 'November':
        return {
          year,
          startDate: new Date(year, 10, 1),
          endDate: new Date(year, 10, 30),
          deadlineDate: new Date(year, 11, 20),
          threeMonthsDate: new Date(year + 1, 2, 28),
        };
    }
  };

  private getReportingPeriodWithDates = (): ReportingPeriodType | undefined => {
    const reportingPeriod = this.getReportingPeriod();
    const dates = this.getReportingPeriodDates(reportingPeriod);
    if (!dates) return undefined;
    return {
      period: reportingPeriod,
      ...dates,
    };
  };

  private getChildrenForPractioner = (
    practitionerUserId: string
  ): ChildDto[] => {
    const { children: childrenState, classroomData: classroomDataState } =
      this.store.getState();

    if (
      !childrenState ||
      !childrenState.children ||
      !classroomDataState ||
      !classroomDataState.classroomGroups
    )
      return [];

    const classroomGroups =
      classroomDataState.classroomGroups?.filter(
        (c) => c.userId === practitionerUserId
      ) || [];
    const learners =
      classroomDataState.classroomGroupLearners?.filter(
        (l) =>
          classroomGroups.some((c) => c.id === l.classroomGroupId) &&
          l.stoppedAttendance === null
      ) || [];
    const children = childrenState.children.filter((c) =>
      learners.some((l) => c.userId === l.userId)
    );

    return children;
  };

  private getChildrenReports = (
    reportingPeriod: ReportingPeriodType,
    practitionerUserId: string
  ): ChildReportType[] => {
    const { contentReportData: contentReportState } = this.store.getState();

    if (!contentReportState || !contentReportState.childProgressReportSummaries)
      return [];

    const children = this.getChildrenForPractioner(practitionerUserId);

    return children.map((child) => {
      const report = contentReportState.childProgressReportSummaries?.find(
        (report) =>
          report.childId === child.id &&
          report.reportPeriod === reportingPeriod.period &&
          new Date(report.reportDate).getFullYear() === reportingPeriod.year
      );
      return {
        child,
        report,
      };
    });
  };

  private notificationAlreadyDone = (reference: string): boolean => {
    const { notifications: notificationsState } = this.store.getState();

    return notificationsState.notificationReferences.includes(reference);
  };

  private getNotificationsCompleteReportsAllChildren = (
    reportingPeriod: ReportingPeriodType
  ): Message[] => {
    const { user: userState, practitioner: practitionerState } =
      this.store.getState();

    if (!practitionerState || !practitionerState.practitioner) return [];

    const currentUser = userState.user;

    const reference = `${currentUser?.id}-${reportingPeriod.period}-${reportingPeriod.year}-AllComplete`;

    if (this.notificationAlreadyDone(reference)) return [];

    const practitioner = practitionerState.practitioner;
    const childrenReports = this.getChildrenReports(
      reportingPeriod,
      practitioner?.userId || ''
    );

    if (childrenReports.length === 0) return [];
    const activeChildrenReports = childrenReports?.filter(
      (item) => item?.child?.isActive === true
    );
    const expectedReportCount = activeChildrenReports?.length;
    const completedReportCount = childrenReports.filter(
      (cr) => cr.report !== undefined
    ).length;

    if (completedReportCount < expectedReportCount) return [];

    const notification: Message = {
      reference,
      title: `Well done, you've created progress reports for all children!`,
      message: `Great job! You can get a summary of what you are working on with each child.`,
      priority: NotificationPriority.high,
      actionText: 'Get summary',
      area: 'progress-report',
      color: 'successMain',
      dateCreated: new Date().toISOString(),
      expiryDate: addMonths(new Date(), 3).toISOString(),
      icon: 'CheckCircleIcon',
      viewOnDashboard: true,
      viewType: 'Both',
      routeConfig: {
        route: '/progress-summary-report',
        params: {
          report: 'completed-all',
        },
      },
    };

    return [notification];
  };

  private getNotificationsPastDeadlineAndReportsNotComplete = (
    reportingPeriod: ReportingPeriodType
  ): Message[] => {
    const { user: userState, practitioner: practitionerState } =
      this.store.getState();

    if (!practitionerState || !practitionerState.practitioner) return [];

    const currentUser = userState.user;

    const reference = `${currentUser?.id}-${reportingPeriod.period}-${reportingPeriod.year}-NotComplete`;
    if (this.notificationAlreadyDone(reference)) return [];

    const practitioner = practitionerState.practitioner;
    const childrenReports = this.getChildrenReports(
      reportingPeriod,
      practitioner?.userId || ''
    );
    if (childrenReports.length === 0) return [];

    const expectedReportCount = childrenReports.length;
    const completedReportCount = childrenReports.filter(
      (cr) => cr.report !== undefined
    ).length;

    if (
      completedReportCount === 0 ||
      completedReportCount === expectedReportCount
    )
      return [];

    const currentDate = new Date();
    if (currentDate.getTime() <= reportingPeriod.deadlineDate.getTime())
      return [];

    const notification: Message = {
      reference,
      title: `See progress summary`,
      message: `You tracked progress for ${completedReportCount} children in ${reportingPeriod.period}. Get the summary of what you are working on with each child.`,
      priority: NotificationPriority.high,
      actionText: 'Get summary',
      area: 'progress-report',
      color: 'infoMain',
      dateCreated: new Date().toISOString(),
      expiryDate: addMonths(new Date(), 3).toISOString(),
      icon: 'InformationIcon',
      viewOnDashboard: true,
      viewType: 'Both',
      routeConfig: {
        route: '/progress-summary-report',
        params: {
          report: 'not-complete',
        },
      },
    };

    return [notification];
  };

  private getNotificationsPrincipalAboutPractioners = (
    reportingPeriod: ReportingPeriodType
  ): Message[] => {
    const { practitioner: practitionerState } = this.store.getState();

    if (
      !practitionerState ||
      !practitionerState.practitioner ||
      !practitionerState.practitioners
    )
      return [];

    const principalPractitioner = practitionerState.practitioner;
    const isPrincipal = principalPractitioner.isPrincipal || false;
    if (!isPrincipal) return [];
    if (practitionerState.practitioners?.length === 1) return [];

    const currentDate = new Date();
    //if ((currentDate.getTime() <= reportingPeriod.deadlineDate.getTime()) || childrenReports.length === 0) return [];

    const messages: Message[] = [];
    const notCompletePractionerIds: string[] = [];

    practitionerState.practitioners
      .filter((practitioner) => !practitioner.isPrincipal)
      .forEach((practitioner) => {
        const childrenReports = this.getChildrenReports(
          reportingPeriod,
          practitioner.userId || ''
        );
        if (childrenReports.length === 0) return;

        const expectedReportCount = childrenReports.length;
        const completedReportCount = childrenReports.filter(
          (cr) => cr.report !== undefined
        ).length;

        if (expectedReportCount === completedReportCount) {
          const message: Message = {
            reference: `${practitioner.userId}-${reportingPeriod.period}-${reportingPeriod.year}-principal-allcomplete`,
            title: `One or more practitioners have created progress reports for all children!`,
            message: `You can see a summary of what ${practitioner.user?.firstName} is working on with each child.`,
            priority: NotificationPriority.high,
            actionText: 'Get summary',
            area: 'progress-report',
            color: 'successMain',
            dateCreated: new Date().toISOString(),
            expiryDate: addMonths(new Date(), 3).toISOString(),
            icon: 'CheckCircleIcon',
            viewOnDashboard: true,
            viewType: 'Hub',
            routeConfig: {
              route: '/progress-summary-report',
              params: {
                report: 'principal-practioner-complete',
                practionerId: practitioner.id,
              },
            },
          };
          messages.push(message);
        }

        if (
          currentDate.getTime() > reportingPeriod.deadlineDate.getTime() &&
          expectedReportCount > 0 &&
          completedReportCount < expectedReportCount &&
          completedReportCount >= 1
        ) {
          notCompletePractionerIds.push(practitioner.id || '');
        }
      });

    if (notCompletePractionerIds.length > 0) {
      const message: Message = {
        reference: `${principalPractitioner.userId}-${reportingPeriod.period}-${reportingPeriod.year}-principal-notcomplete`,
        title: `See progress summaries!`,
        message: `You can see summaries of what your practitioners are working on with children in their classes.`,
        priority: NotificationPriority.high,
        actionText: 'Get summary',
        area: 'progress-report',
        color: 'infoMain',
        dateCreated: new Date().toISOString(),
        expiryDate: addMonths(new Date(), 3).toISOString(),
        icon: 'InformationIcon',
        viewOnDashboard: true,
        viewType: 'Hub',
        routeConfig: {
          route: '/progress-summary-report',
          params: {
            report: 'principal-practioner-notcomplete',
            practionerIds: notCompletePractionerIds,
          },
        },
      };
      messages.push(message);
    }

    return messages;
  };

  getNotifications = (): Message[] => {
    const { notifications: notificationsState, user: userState } =
      this.store.getState();

    const currentUser = userState.user;
    if (!currentUser) return [];

    const reportingPeriod = this.getReportingPeriodWithDates();
    if (!reportingPeriod) return [];

    const newNotifications: Message[] = [];

    newNotifications.push(
      ...this.getNotificationsCompleteReportsAllChildren(reportingPeriod)
    );
    newNotifications.push(
      ...this.getNotificationsPastDeadlineAndReportsNotComplete(reportingPeriod)
    );
    newNotifications.push(
      ...this.getNotificationsPrincipalAboutPractioners(reportingPeriod)
    );

    // don't add if added already ??
    const notifications = newNotifications.filter(
      (newNot) =>
        !notificationsState.notifications.some(
          (curNot) => curNot.message.reference === newNot.reference
        )
    );

    return notifications;
  };
}
