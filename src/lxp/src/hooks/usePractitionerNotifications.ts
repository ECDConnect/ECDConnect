import { useMemo } from 'react';

export type UUID = string;

export type Practitioner = {
  id: UUID;
  userId: UUID;
  isActive: boolean;
  insertedDate: string | Date;
  isRegistered?: boolean | null;
  isPrincipal?: boolean | null;
  isOnStipend?: boolean | null;
  startDate?: string | Date | null;
  coachHierarchy?: UUID | null;
  principalHierarchy?: UUID | null;
  programmeType?: string | null;
  progress?: number;
  shareInfo?: boolean | null;
  user?: {
    id: UUID;
    lastSeen?: string | Date;
    fullName?: string;
    idNumber?: string;
  } | null;
};

export type Absentee = {
  id?: UUID;
  userId?: UUID; // practitioner user id
  absentDate: string | Date;
  absentDateEnd?: string | Date | null;
  reason?: string;
};

export type NotificationDisplay = {
  userId?: UUID | null;
  userType?: string;
  subject: string;
  icon?: string;
  color?: string;
  message?: string;
  notes?: string;
  groupingName?: string;
};

const MetricsIconEnum = {
  Error: 'Error',
  Warning: 'Warning',
  Success: 'Success',
  None: 'None',
};
const MetricsColorEnum = {
  Error: 'Error',
  Warning: 'Warning',
  Success: 'Success',
  None: 'None',
};

const DEFAULT_NOW = () => new Date();

export function usePractitionerNotifications(options: {
  practitioners: Practitioner[] | undefined;
  mode: 'coach' | 'principal' | 'self' | string;
  now?: Date;
  removals?: {
    userId: UUID;
    isActive: boolean;
    insertedDate?: string | Date;
    dateOfRemoval?: string | Date;
  }[];
  absentees?: Absentee[];
  childProgressReportService?: {
    getReportOverDueStart: (year: number, isPeriod1: boolean) => Date;
    getReportOverDueEnd: (year: number, isPeriod1: boolean) => Date;
  } | null;
  attendanceService?: {
    getAllLearnerGroupInstances?: (groupId: UUID) => any[];
  } | null;
  holidayService?: { isBusinessDay?: (d: Date) => boolean } | null;
}) {
  const {
    practitioners,
    mode,
    now = DEFAULT_NOW(),
    removals = [],
    absentees = [],
    attendanceService = null,
  } = options;

  return useMemo<NotificationDisplay[]>(() => {
    const results: NotificationDisplay[] = [];

    const toDate = (v?: string | Date | null) =>
      v ? new Date(v as string) : null;

    const startOfPreviousMonth = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth() - 1, 1);
    const endOfPreviousMonth = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), 0, 23, 59, 59, 999);

    const previousMonthStart = startOfPreviousMonth(now);
    const previousMonthEnd = endOfPreviousMonth(now);

    const getUserRemovals = (userId?: UUID) =>
      removals.filter((r) => r.userId === userId && r.isActive);

    const getAbsenteesForUser = (userId?: UUID) =>
      absentees.filter((a) => a.userId === userId);

    const safeFormatDate = (d?: Date | string | null) =>
      d ? new Date(d as string).toLocaleDateString() : '';

    const filteredPractitioners = practitioners?.filter((p) => {
      if (mode === 'coach') return !!p.coachHierarchy;
      if (mode === 'principal') return !!p.principalHierarchy;
      return true;
    });

    for (const practitioner of filteredPractitioners!) {
      const notificationBase: Partial<NotificationDisplay> = {
        userId: practitioner.userId,
        userType: 'practitioner',
      };

      if (!practitioner.isRegistered) {
        results.push({
          ...(notificationBase as NotificationDisplay),
          subject: 'Has not joined preschool',
          icon: MetricsIconEnum.Error,
          color: MetricsColorEnum.Error,
          groupingName: 'Not registered on app',
        });
        continue;
      }

      // REMOVED FROM PROGRAMME
      const removalHistory = getUserRemovals(practitioner.userId).sort(
        (a, b) =>
          (toDate(b.insertedDate)?.getTime() ?? 0) -
          (toDate(a.insertedDate)?.getTime() ?? 0)
      )[0];
      if (removalHistory) {
        results.push({
          ...(notificationBase as NotificationDisplay),
          subject: `Practitioner is leaving on ${safeFormatDate(
            removalHistory.dateOfRemoval as Date
          )}`,
          icon: MetricsIconEnum.Error,
          color: MetricsColorEnum.Error,
          notes: `Practitioner is leaving on ${safeFormatDate(
            removalHistory.dateOfRemoval as Date
          )}`,
          groupingName: 'Removed from preschool',
        });
        continue;
      }

      // ABSENTEES checks
      const practitionerAbsenteeDays = getAbsenteesForUser(
        practitioner.userId
      ).filter(
        (a) =>
          toDate(a.absentDate)! >= previousMonthStart &&
          toDate(a.absentDate)! <= now &&
          a.reason !== 'Practitioner removed from programme'
      );
      if (
        practitionerAbsenteeDays.some(
          (x) => toDate(x.absentDate)!.toDateString() === now.toDateString()
        )
      ) {
        results.push({
          ...(notificationBase as NotificationDisplay),
          subject: 'On leave',
          icon: MetricsIconEnum.Error,
          color: MetricsColorEnum.Error,
          groupingName: 'On leave',
        });
        continue;
      }

      if (
        practitionerAbsenteeDays.length > 0 &&
        practitionerAbsenteeDays.length <= 5 &&
        practitionerAbsenteeDays.some(
          (x) => toDate(x.absentDate)! <= previousMonthEnd
        )
      ) {
        results.push({
          ...(notificationBase as NotificationDisplay),
          subject: `${practitionerAbsenteeDays.length} days absent last month`,
          icon: MetricsIconEnum.Warning,
          color: MetricsColorEnum.Warning,
          groupingName: 'On leave',
        });
        continue;
      }

      // ATTENDANCE PERCENTAGE checks (child attendance)
      if (
        attendanceService &&
        typeof (attendanceService as any).getAttendancePercentileByParent ===
          'function'
      ) {
        const percent = (
          attendanceService as any
        ).getAttendancePercentileByParent(
          practitioner.userId,
          previousMonthStart,
          previousMonthEnd
        );
        if (percent < 75) {
          results.push({
            ...(notificationBase as NotificationDisplay),
            subject: `${percent}% child attendance in ${previousMonthStart.toLocaleString(
              'default',
              { month: 'short' }
            )}`,
            icon: MetricsIconEnum.Warning,
            color: MetricsColorEnum.Warning,
            notes: 'Improve attendance',
            groupingName: 'Less than 75% child attendance last month',
          });
          continue;
        }
        if (percent >= 75) {
          results.push({
            ...(notificationBase as NotificationDisplay),
            subject: `${percent}% child attendance in ${previousMonthStart.toLocaleString(
              'default',
              { month: 'short' }
            )}`,
            icon: MetricsIconEnum.Success,
            color: MetricsColorEnum.Success,
            groupingName: 'Better than 75% child attendance last month',
          });
          continue;
        }
      }
      results.push({
        ...(notificationBase as NotificationDisplay),
        subject: '',
        icon: MetricsIconEnum.Success,
        color: MetricsColorEnum.Success,
        groupingName: 'Practitioner',
      });
    }

    return results;
  }, [practitioners, mode, now, removals, absentees, attendanceService]);
}

export default usePractitionerNotifications;
