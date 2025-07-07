import { EnhancedStore } from '@reduxjs/toolkit';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import {
  NotificationValidator,
  NotificationIntervals,
} from '../../NotificationService.types';
import {
  ChildDto,
  ChildProgressReportSummaryModel,
  MessageLogDto,
} from '@ecdlink/core';
import { addDays, addMonths, isBefore } from 'date-fns';
import { TabsItems } from '@/pages/classroom/class-dashboard/class-dashboard.types';
import ROUTES from '@/routes/routes';
import { ChildProgressReportPeriodDto } from '@/models/classroom/classroom.dto';
import { ChildProgressReport } from '@ecdlink/graphql';
import { referenceNames } from '../points/poinstNotificationValidator.types';

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
    const currentYear = today.getFullYear();

    const currentYearsReportingPeriods =
      reportingPeriods
        ?.filter((x) => new Date(x.startDate).getFullYear() === currentYear)
        .sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        ) || [];

    // Get first in order where end date is after the current date
    const index = currentYearsReportingPeriods.findIndex((x) =>
      isBefore(
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate()
        ),
        new Date(x.endDate)
      )
    );

    if (index < 0) {
      return undefined;
    }

    const startDate = new Date(currentYearsReportingPeriods[index].startDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(currentYearsReportingPeriods[index].endDate);
    endDate.setHours(23, 59, 59, 0);

    return {
      id: currentYearsReportingPeriods[index].id,
      startDate: startDate.toString(),
      endDate: endDate.toString(),
      notifications: currentYearsReportingPeriods[index].notifications,
    };
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
        isFromBackend: false,
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
    const {
      practitioner: practitionerState,
      classroomData: classroomState,
      tenant: tenantState,
    } = this.store.getState();
    const today = new Date();
    const hasPermission = tenantState.tenant?.modules?.progressEnabled;

    if (!practitionerState || !practitionerState.practitioner) return [];
    if (
      !practitionerState.practitioner.isPrincipal &&
      (!hasPermission || !classroomState?.classroom?.childProgressReportPeriods)
    )
      return [];

    const reportingPeriods =
      classroomState?.classroom?.childProgressReportPeriods!;
    const currentReportPeriod = this?.getCurrentReportPeriod(reportingPeriods);
    const currentNotifications = currentReportPeriod?.notifications;
    const notifications: Message[] = [];

    if (currentNotifications && currentNotifications.length > 0) {
      currentNotifications.forEach((item: MessageLogDto) => {
        if (
          today.getTime() >= new Date(item.messageDate).getTime() &&
          today.getTime() <= new Date(item.messageEndDate!).getTime()
        ) {
          notifications.push({
            reference: item.id!,
            title: item.subject,
            message: item.message,
            priority: 22,
            actionText: item.cTAText!,
            area: 'progress-report',
            color: 'alertMain',
            dateCreated: new Date(item.messageDate).toISOString(),
            expiryDate: new Date(item.messageEndDate!).toISOString(),
            icon: 'ExclamationIcon',
            viewOnDashboard: true,
            isFromBackend: true,
            cta: item.cTA,
            viewType: item.messageProtocol === 'hub' ? 'Hub' : 'Messages',
            routeConfig: {
              route: ROUTES.CLASSROOM.ROOT,
              params: {
                activeTabIndex: TabsItems.PROGRESS,
                messageReference: item.id!,
              },
            },
          });
        }
      });
    }
    return notifications;
  };

  // private getNotificationsCreatedReportsAllChildren = (
  //   reportingPeriod: ReportingPeriodType
  // ): Message[] => {
  //   const {
  //     practitioner: practitionerState,
  //     classroomData: classroomState,
  //     children: childrenState,
  //   } = this.store.getState();

  //   if (!practitionerState || !practitionerState.practitioner) return [];

  //   const children = childrenState?.childData?.children;

  //   const reference = referenceNames.allChildrenProgressReportsCreated;

  //   if (this.notificationAlreadyDone(reference)) return [];

  //   if (!classroomState?.classroom?.childProgressReportPeriods) return [];

  //   const reportingPeriods =
  //     classroomState?.classroom?.childProgressReportPeriods;

  //   const currentReportPeriod = this?.getCurrentReportPeriod(reportingPeriods);

  //   const reports = this.getChildrenProgressReports(currentReportPeriod!);
  //   const today = new Date();
  //   const isBetweenReportProgressPeriodDate =
  //     today >= new Date(currentReportPeriod?.startDate!) &&
  //     today <= new Date(currentReportPeriod?.endDate!);
  //   const activeChildren = children?.filter((item) => item?.isActive === true);

  //   const reportsCompleted = Math.ceil(
  //     (reports.filter((x) => !!x?.dateCompleted).length / reports.length) * 100
  //   );

  //   if (activeChildren?.length === 0) return [];
  //   if (!isBetweenReportProgressPeriodDate) return [];
  //   if (
  //     reports?.length === 0 ||
  //     reports?.length < activeChildren.length ||
  //     reportsCompleted < 100
  //   )
  //     return [];

  //   const notification: Message = {
  //     reference,
  //     title: `Well done, all progress reports complete!`,
  //     message: `Great job! View a summary of the skills each class is working on.`,
  //     priority: 23,
  //     actionText: 'Get summary',
  //     area: 'progress-report',
  //     color: 'successMain',
  //     dateCreated: new Date().toISOString(),
  //     expiryDate: addDays(new Date(), 7).toISOString(),
  //     icon: 'CheckCircleIcon',
  //     viewOnDashboard: true,
  //     isFromBackend: false,
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

  getNotifications = (): Message[] => {
    const { notifications: notificationsState, user: userState } =
      this.store.getState();

    const currentUser = userState.user;
    if (!currentUser) return [];

    const reportingPeriod = this.getReportingPeriodWithDates();
    if (!reportingPeriod) return [];

    const newNotifications: Message[] = [];

    // newNotifications.push(
    //   ...this.getNotificationsCreatedReportsAllChildren(reportingPeriod)
    // );

    newNotifications?.push(...this.getNotificationForNoProgressReportPeriods());
    newNotifications?.push(...this.getSevenDaysBeforeWithNoProgressReports());

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
