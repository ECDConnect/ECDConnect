import { EnhancedStore } from '@reduxjs/toolkit';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import {
  NotificationPriority,
  NotificationValidator,
  NotificationIntervals,
} from '../../NotificationService.types';
import { ChildDto, ChildProgressReportSummaryModel } from '@ecdlink/core';
import { addDays, addMonths, format, sub, subDays } from 'date-fns';
import { TabsItems } from '@/pages/classroom/class-dashboard/class-dashboard.types';
import ROUTES from '@/routes/routes';
import { ChildProgressReportPeriodDto } from '@/models/classroom/classroom.dto';
import { ChildProgressReport } from '@ecdlink/graphql';
import { referenceNames } from '../points/poinstNotificationValidator.types';
import { PermissionsNames } from '@/pages/principal/components/add-practitioner/add-practitioner.types';

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
      !childrenState.childData.children.length ||
      !classroomDataState ||
      !classroomDataState.classroomGroupData.classroomGroups.length
    )
      return [];

    const classroomGroups =
      classroomDataState.classroomGroupData.classroomGroups.filter(
        (c) => c.userId === practitionerUserId
      ) || [];
    const learners = classroomGroups.flatMap((cg) => cg.learners);
    const children = childrenState.childData.children.filter((c) =>
      learners.some((l) => c.userId === l.childUserId)
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

  private getChildrenProgressReports = (
    reportingPeriod: ChildProgressReportPeriodDto
  ): ChildProgressReport[] => {
    const { progressTracking: progressTrackingState } = this.store.getState();

    if (!progressTrackingState || !progressTrackingState.childProgressReports)
      return [];

    const childrenProgressReports: unknown =
      progressTrackingState.childProgressReports.filter(
        (report) =>
          new Date(report?.dateCreated!) >=
            new Date(reportingPeriod?.startDate) &&
          new Date(report?.dateCreated!) <= new Date(reportingPeriod?.endDate)
      );

    return childrenProgressReports as ChildProgressReport[];
  };

  private getCompletedChildrenProgressReports = (
    reportingPeriod: ChildProgressReportPeriodDto
  ): ChildProgressReport[] => {
    const { progressTracking: progressTrackingState } = this.store.getState();

    if (!progressTrackingState || !progressTrackingState.childProgressReports)
      return [];

    const childrenProgressReports: unknown =
      progressTrackingState.childProgressReports.filter(
        (report) =>
          new Date(report?.dateCompleted!) >=
            new Date(reportingPeriod?.startDate) &&
          new Date(report?.dateCompleted!) <= new Date(reportingPeriod?.endDate)
      );

    return childrenProgressReports as ChildProgressReport[];
  };

  private getCurrentReportPeriod = (
    reportingPeriods: ChildProgressReportPeriodDto[]
  ): ChildProgressReportPeriodDto | undefined => {
    const today = new Date();

    const currentReportPeriod = reportingPeriods?.find(
      (item) =>
        new Date(item?.startDate) < today && new Date(item?.endDate) > today
    );
    return currentReportPeriod;
  };

  private notificationAlreadyDone = (reference: string): boolean => {
    const { notifications: notificationsState } = this.store.getState();

    return notificationsState.notificationReferences.includes(reference);
  };

  private getNotificationForNoProgressReportPeriods = (): Message[] => {
    const {
      user: userState,
      practitioner: practitionerState,
      classroomData: classroomState,
    } = this.store.getState();
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const februaryFirstDay = new Date(currentYear, 1, 1);

    if (!practitionerState || !practitionerState.practitioner) return [];

    const notifications: Message[] = [];
    const currentUser = userState.user;

    const reference = `${currentUser?.id}-${currentMonth}-${currentYear}-report-periods`;

    if (
      today === februaryFirstDay &&
      !classroomState?.classroom?.childProgressReportPeriods
    ) {
      notifications?.push({
        reference,
        title: `Get started with ${currentYear} progress reports`,
        message: `Choose progress reporting periods for ${currentYear} to start tracking child progress.`,
        priority: 21,
        actionText: 'Get summary',
        area: 'progress-report',
        color: 'alertMain',
        dateCreated: new Date().toISOString(),
        expiryDate: addMonths(new Date(), 3).toISOString(),
        icon: 'ExclamationIcon',
        viewOnDashboard: true,
        viewType: 'Both',
        routeConfig: {
          route: ROUTES.CLASSROOM.ROOT,
          params: {
            activeTabIndex: TabsItems.PROGRESS,
            messageReference: reference,
          },
        },
      });
    }

    return notifications;
  };

  private getSevenDaysBeforeWithNoProgressReports = (): Message[] => {
    const { practitioner: practitionerState, classroomData: classroomState } =
      this.store.getState();
    const today = new Date();

    if (!classroomState?.classroom?.childProgressReportPeriods) return [];

    const reportingPeriods =
      classroomState?.classroom?.childProgressReportPeriods;

    const currentReportPeriod = this?.getCurrentReportPeriod(reportingPeriods);

    const reportPeriodEndDate = new Date(currentReportPeriod?.endDate!);
    const sevenDaysBeforeEndDate = subDays(reportPeriodEndDate, 7);

    const reports = this.getChildrenProgressReports(currentReportPeriod!);

    if (!practitionerState || !practitionerState.practitioner) return [];

    const notifications: Message[] = [];

    const reference = `getSevenDaysBeforeWithNoProgressReports`;

    if (
      classroomState?.classroom?.childProgressReportPeriods &&
      today === sevenDaysBeforeEndDate &&
      reports?.length === 0
    ) {
      notifications?.push({
        reference,
        title: `Finish your progress reports`,
        message: `The deadline is coming up on ${format(
          reportPeriodEndDate,
          'd MMMM y'
        )}! Create the reports to share with caregivers.`,
        priority: 22,
        actionText: 'Create reports',
        area: 'progress-report',
        color: 'alertMain',
        dateCreated: new Date().toISOString(),
        expiryDate: addMonths(new Date(), 3).toISOString(),
        icon: 'ExclamationIcon',
        viewOnDashboard: true,
        viewType: 'Both',
        routeConfig: {
          route: ROUTES.CLASSROOM.ROOT,
          params: {
            activeTabIndex: TabsItems.PROGRESS,
            messageReference: reference,
          },
        },
      });
    }

    return notifications;
  };

  private getNotificationsCreatedReportsAllChildren = (
    reportingPeriod: ReportingPeriodType
  ): Message[] => {
    const {
      user: userState,
      practitioner: practitionerState,
      classroomData: classroomState,
      children: childrenState,
    } = this.store.getState();

    if (!practitionerState || !practitionerState.practitioner) return [];

    const currentUser = userState.user;
    const children = childrenState?.childData?.children;

    const reference = referenceNames.allChildrenProgressReportsCreated;

    if (this.notificationAlreadyDone(reference)) return [];

    if (!classroomState?.classroom?.childProgressReportPeriods) return [];

    const reportingPeriods =
      classroomState?.classroom?.childProgressReportPeriods;

    const currentReportPeriod = this?.getCurrentReportPeriod(reportingPeriods);

    const reports = this.getChildrenProgressReports(currentReportPeriod!);
    const today = new Date();
    const isBetweenReportProgressPeriodDate =
      today >= new Date(currentReportPeriod?.startDate!) &&
      today <= new Date(currentReportPeriod?.endDate!);
    const activeChildren = children?.filter((item) => item?.isActive === true);

    const reportsCompleted = Math.ceil(
      (reports.filter((x) => !!x?.dateCompleted).length / reports.length) * 100
    );

    if (activeChildren?.length === 0) return [];
    if (!isBetweenReportProgressPeriodDate) return [];
    if (reports?.length === 0 || reportsCompleted < 100) return [];

    const notification: Message = {
      reference,
      title: `Well done, you've created progress reports for all children!`,
      message: `Great job! You can get a summary of what you are working on with each child.`,
      priority: 23,
      actionText: 'Get summary',
      area: 'progress-report',
      color: 'successMain',
      dateCreated: new Date().toISOString(),
      expiryDate: addDays(new Date(), 7).toISOString(),
      icon: 'CheckCircleIcon',
      viewOnDashboard: true,
      viewType: 'Both',
      routeConfig: {
        route:
          ROUTES.PROGRESS_VIEW_REPORTS_SUMMARY_SELECT_CLASSROOM_GROUP_AND_AGE_GROUP,
        params: {
          report: 'completed-all',
        },
      },
    };

    return [notification];
  };

  // private getNotificationsCompletedReportsAllChildren = (
  //   reportingPeriod: ReportingPeriodType
  // ): Message[] => {
  //   const {
  //     user: userState,
  //     practitioner: practitionerState,
  //     classroomData: classroomState,
  //     children: childrenState,
  //   } = this.store.getState();

  //   if (!practitionerState || !practitionerState.practitioner) return [];

  //   if (!practitionerState || !practitionerState.practitioner) return [];
  //   const createProgressReportsPermission =
  //     practitionerState?.practitioner?.permissions?.find(
  //       (item) =>
  //         item?.permissionName === PermissionsNames.create_progress_reports
  //     );

  //   if (
  //     !practitionerState?.practitioner?.isPrincipal &&
  //     !createProgressReportsPermission
  //   )
  //     return [];

  //   const currentUser = userState.user;
  //   const children = childrenState?.childData?.children;

  //   const reference = referenceNames.allChildrenProgressReportsCreated;

  //   if (this.notificationAlreadyDone(reference)) return [];

  //   if (!classroomState?.classroom?.childProgressReportPeriods) return [];

  //   const reportingPeriods =
  //     classroomState?.classroom?.childProgressReportPeriods;

  //   const currentReportPeriod = this?.getCurrentReportPeriod(reportingPeriods);

  //   const reports = this.getCompletedChildrenProgressReports(
  //     currentReportPeriod!
  //   );

  //   const today = new Date();
  //   const isBetweenReportProgressPeriodDate =
  //     today >= new Date(currentReportPeriod?.startDate!) &&
  //     today <= new Date(currentReportPeriod?.endDate!);
  //   const activeChildren = children?.filter((item) => item?.isActive === true);

  //   if (activeChildren?.length === 0) return [];

  //   const expectedReportCount = activeChildren?.length;

  //   if (!isBetweenReportProgressPeriodDate) return [];

  //   if (reports?.length < expectedReportCount) return [];

  //   const notification: Message = {
  //     reference,
  //     title: `Well done, you've created progress reports for all children!`,
  //     message: `Great job! You can get a summary of what you are working on with each child.`,
  //     priority: 24,
  //     actionText: 'Get summary',
  //     area: 'progress-report',
  //     color: 'successMain',
  //     dateCreated: new Date().toISOString(),
  //     expiryDate: addDays(new Date(), 7).toISOString(),
  //     icon: 'CheckCircleIcon',
  //     viewOnDashboard: true,
  //     viewType: 'Both',
  //     routeConfig: {
  //       route:
  //         ROUTES.PROGRESS_VIEW_REPORTS_SUMMARY_SELECT_CLASSROOM_GROUP_AND_AGE_GROUP,
  //       params: {
  //         report: 'completed-all',
  //       },
  //     },
  //   };

  //   return [notification];
  // };

  private getNotificationsPastDeadlineDate = (
    reportingPeriod: ReportingPeriodType
  ): Message[] => {
    const {
      practitioner: practitionerState,
      classroomData: classroomState,
      children: childrenState,
    } = this.store.getState();

    if (!practitionerState || !practitionerState.practitioner) return [];
    const createProgressReportsPermission =
      practitionerState?.practitioner?.permissions?.find(
        (item) =>
          item?.permissionName === PermissionsNames.create_progress_reports
      );

    if (
      !practitionerState?.practitioner?.isPrincipal &&
      !createProgressReportsPermission
    )
      return [];

    const children = childrenState?.childData?.children;

    const reference = referenceNames?.pastDeadlineDateForProgressReports;

    if (this.notificationAlreadyDone(reference)) return [];

    if (!classroomState?.classroom?.childProgressReportPeriods) return [];

    const activeChildren = children?.filter((item) => item?.isActive === true);

    if (activeChildren?.length === 0) return [];

    const reportingPeriods =
      classroomState?.classroom?.childProgressReportPeriods;

    const currentReportPeriod = this?.getCurrentReportPeriod(reportingPeriods);

    const reports = this?.getCompletedChildrenProgressReports(
      currentReportPeriod!
    );

    const today = new Date();
    const pastOneDayAfterReportPeriodEndDate = addDays(
      new Date(currentReportPeriod?.endDate!),
      1
    );
    const isPastOneDayAfterReportPeriodEndDate =
      today === pastOneDayAfterReportPeriodEndDate;

    const expectedReportCount = activeChildren?.length;

    if (!isPastOneDayAfterReportPeriodEndDate) return [];

    if (reports?.length === expectedReportCount) return [];

    const notification: Message = {
      reference,
      title: `See progress summary`,
      message: `Progress reports created for ${reports?.length} children! See a summary of the skills your class is working on.`,
      priority: 25,
      actionText: 'Get summary',
      area: 'progress-report',
      color: 'infoMain',
      dateCreated: new Date().toISOString(),
      expiryDate: addDays(new Date(), 7).toISOString(),
      icon: 'InformationCircleIcon',
      viewOnDashboard: true,
      viewType: 'Both',
      routeConfig: {
        route:
          ROUTES.PROGRESS_VIEW_REPORTS_SUMMARY_SELECT_CLASSROOM_GROUP_AND_AGE_GROUP,
        params: {
          report: 'completed-all',
        },
      },
    };

    return [notification];
  };

  // private getNotificationsPastDeadlineAndReportsNotComplete = (
  //   reportingPeriod: ReportingPeriodType
  // ): Message[] => {
  //   const { user: userState, practitioner: practitionerState } =
  //     this.store.getState();

  //   if (!practitionerState || !practitionerState.practitioner) return [];

  //   const currentUser = userState.user;

  //   const reference = `${currentUser?.id}-${reportingPeriod.period}-${reportingPeriod.year}-NotComplete`;
  //   if (this.notificationAlreadyDone(reference)) return [];

  //   const practitioner = practitionerState.practitioner;
  //   const childrenReports = this.getChildrenReports(
  //     reportingPeriod,
  //     practitioner?.userId || ''
  //   );
  //   if (childrenReports.length === 0) return [];

  //   const expectedReportCount = childrenReports.length;
  //   const completedReportCount = childrenReports.filter(
  //     (cr) => cr.report !== undefined
  //   ).length;

  //   if (
  //     completedReportCount === 0 ||
  //     completedReportCount === expectedReportCount
  //   )
  //     return [];

  //   const currentDate = new Date();
  //   if (currentDate.getTime() <= reportingPeriod.deadlineDate.getTime())
  //     return [];

  //   const notification: Message = {
  //     reference,
  //     title: `See progress summary`,
  //     message: `You tracked progress for ${completedReportCount} children in ${reportingPeriod.period}. Get the summary of what you are working on with each child.`,
  //     priority: NotificationPriority.high,
  //     actionText: 'Get summary',
  //     area: 'progress-report',
  //     color: 'infoMain',
  //     dateCreated: new Date().toISOString(),
  //     expiryDate: addMonths(new Date(), 3).toISOString(),
  //     icon: 'CheckCircleIcon',
  //     viewOnDashboard: true,
  //     viewType: 'Both',
  //     routeConfig: {
  //       route: '/progress-summary-report',
  //       params: {
  //         report: 'not-complete',
  //       },
  //     },
  //   };

  //   return [notification];
  // };

  // private getNotificationsPrincipalAboutPractioners = (
  //   reportingPeriod: ReportingPeriodType
  // ): Message[] => {
  //   const { practitioner: practitionerState } = this.store.getState();

  //   if (
  //     !practitionerState ||
  //     !practitionerState.practitioner ||
  //     !practitionerState.practitioners
  //   )
  //     return [];

  //   const principalPractitioner = practitionerState.practitioner;
  //   const isPrincipal = principalPractitioner.isPrincipal || false;
  //   if (!isPrincipal) return [];
  //   if (practitionerState.practitioners?.length === 1) return [];

  //   const currentDate = new Date();
  //   //if ((currentDate.getTime() <= reportingPeriod.deadlineDate.getTime()) || childrenReports.length === 0) return [];

  //   const messages: Message[] = [];
  //   const notCompletePractionerIds: string[] = [];

  //   practitionerState.practitioners
  //     .filter((practitioner) => !practitioner.isPrincipal)
  //     .forEach((practitioner) => {
  //       const childrenReports = this.getChildrenReports(
  //         reportingPeriod,
  //         practitioner.userId || ''
  //       );
  //       if (childrenReports.length === 0) return;

  //       const expectedReportCount = childrenReports.length;
  //       const completedReportCount = childrenReports.filter(
  //         (cr) => cr.report !== undefined
  //       ).length;

  //       if (expectedReportCount === completedReportCount) {
  //         const message: Message = {
  //           reference: `${practitioner.userId}-${reportingPeriod.period}-${reportingPeriod.year}-principal-allcomplete`,
  //           title: `One or more practitioners have created progress reports for all children!`,
  //           message: `You can see a summary of what ${practitioner.user?.firstName} is working on with each child.`,
  //           priority: NotificationPriority.high,
  //           actionText: 'Get summary',
  //           area: 'progress-report',
  //           color: 'successMain',
  //           dateCreated: new Date().toISOString(),
  //           expiryDate: addMonths(new Date(), 3).toISOString(),
  //           icon: 'CheckCircleIcon',
  //           viewOnDashboard: true,
  //           viewType: 'Hub',
  //           routeConfig: {
  //             route: '/progress-summary-report',
  //             params: {
  //               report: 'principal-practioner-complete',
  //               practionerId: practitioner.id,
  //             },
  //           },
  //         };
  //         messages.push(message);
  //       }

  //       if (
  //         currentDate.getTime() > reportingPeriod.deadlineDate.getTime() &&
  //         expectedReportCount > 0 &&
  //         completedReportCount < expectedReportCount &&
  //         completedReportCount >= 1
  //       ) {
  //         notCompletePractionerIds.push(practitioner.id || '');
  //       }
  //     });

  //   if (notCompletePractionerIds.length > 0) {
  //     const message: Message = {
  //       reference: `${principalPractitioner.userId}-${reportingPeriod.period}-${reportingPeriod.year}-principal-notcomplete`,
  //       title: `See progress summaries!`,
  //       message: `You can see summaries of what your practitioners are working on with children in their classes.`,
  //       priority: NotificationPriority.high,
  //       actionText: 'Get summary',
  //       area: 'progress-report',
  //       color: 'infoMain',
  //       dateCreated: new Date().toISOString(),
  //       expiryDate: addMonths(new Date(), 3).toISOString(),
  //       icon: 'InformationIcon',
  //       viewOnDashboard: true,
  //       viewType: 'Hub',
  //       routeConfig: {
  //         route: '/progress-summary-report',
  //         params: {
  //           report: 'principal-practioner-notcomplete',
  //           practionerIds: notCompletePractionerIds,
  //         },
  //       },
  //     };
  //     messages.push(message);
  //   }

  //   return messages;
  // };

  getNotifications = (): Message[] => {
    const { notifications: notificationsState, user: userState } =
      this.store.getState();

    const currentUser = userState.user;
    if (!currentUser) return [];

    const reportingPeriod = this.getReportingPeriodWithDates();
    if (!reportingPeriod) return [];

    const newNotifications: Message[] = [];

    newNotifications.push(
      ...this.getNotificationsCreatedReportsAllChildren(reportingPeriod)
    );
    // newNotifications.push(
    //   ...this.getNotificationsPastDeadlineAndReportsNotComplete(reportingPeriod)
    // );
    // newNotifications.push(
    //   ...this.getNotificationsPrincipalAboutPractioners(reportingPeriod)
    // );

    newNotifications?.push(...this.getNotificationForNoProgressReportPeriods());
    newNotifications?.push(...this.getSevenDaysBeforeWithNoProgressReports());
    // newNotifications?.push(
    //   ...this.getNotificationsCompletedReportsAllChildren(reportingPeriod)
    // );
    newNotifications?.push(
      ...this.getNotificationsPastDeadlineDate(reportingPeriod)
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
