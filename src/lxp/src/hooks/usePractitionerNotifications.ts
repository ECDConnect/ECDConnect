import { attendanceSelectors } from '@/store/attendance';
import { classroomsSelectors } from '@/store/classroom';
import { practitionerSelectors } from '@/store/practitioner';
import { getMissedClassAttendance } from '@/utils/classroom/attendance/track-attendance-utils';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

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

export function usePractitionerNotifications(
  options: {
    mode?: 'coach' | 'principal' | 'self' | string; // Now optional with default
    now?: Date;
  } = {}
) {
  const {
    mode = 'principal', // Default to 'principal' or whatever fits most use cases
    now = DEFAULT_NOW(),
  } = options;

  const classroomGroups =
    useSelector(classroomsSelectors.getClassroomGroups) ?? [];
  const practitioners =
    useSelector(practitionerSelectors.getPractitioners) ?? [];
  const attendance = useSelector(attendanceSelectors.getAttendance) ?? [];

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
      practitioners
        .find((a) => a.userId === userId)
        ?.absentees?.filter(
          (a) => a.reason === 'Practitioner removed from programme'
        ) ?? [];

    const getAbsenteesForUser = (userId?: UUID) =>
      practitioners.find((a) => a.userId === userId)?.absentees ?? [];

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
            removalHistory.absentDate as Date
          )}`,
          icon: MetricsIconEnum.Error,
          color: MetricsColorEnum.Error,
          notes: `Practitioner is leaving on ${safeFormatDate(
            removalHistory.absentDate as Date
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

      const practitionerClassroomGrups =
        classroomGroups.filter(
          (classroomGroup) => classroomGroup.userId === practitioner.userId
        ) || [];

      let sumOfProgrammePercentages = 0;
      let programmeCountWithAttendance = 0;

      for (const group of practitionerClassroomGrups) {
        const programmes = (group.classProgrammes || []).filter(
          (p) => p.isActive
        );

        for (const programme of programmes) {
          const programmeAttendance = attendance.filter(
            (a) =>
              a.classroomProgrammeId === programme.id &&
              a.attendanceDate &&
              new Date(a.attendanceDate) >= previousMonthStart &&
              new Date(a.attendanceDate) <= previousMonthEnd
          );

          if (programmeAttendance.length === 0) continue;

          let present = 0;
          let total = 0;

          for (const att of programmeAttendance) {
            if (att.attended === true) present++;
            if (att.attended !== null) total++; // only count marked records
          }

          if (total > 0) {
            const progPercent = Math.round((present / total) * 100);
            sumOfProgrammePercentages += progPercent;
            programmeCountWithAttendance++;
          }
        }
      }

      const percent =
        programmeCountWithAttendance > 0
          ? Math.round(sumOfProgrammePercentages / programmeCountWithAttendance)
          : 0;

      if (typeof percent === 'number') {
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
  }, [practitioners, mode, now]);
}

export default usePractitionerNotifications;
