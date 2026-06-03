import { useEffect, useState } from 'react';
import {
  AttendanceDto,
  HolidayDto,
  MonthlyAttendanceRecord,
} from '@ecdlink/core';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import {
  endOfMonth,
  startOfMonth,
  addMonths,
  startOfDay,
  isSameDay,
} from 'date-fns';
import { getWorkingDays } from '@/utils/common/date.utils';
import {
  calculateDaysOfClassForMonth,
  normalizeToStartOfDay,
} from '@/utils/classroom/attendance/track-attendance-utils';

export function useMonthlyAttendanceSummary(
  attendanceData: AttendanceDto[],
  classroomGroups: ClassroomGroupDto[],
  holidays: HolidayDto[]
) {
  const [monthlySummary, setMonthlySummary] =
    useState<MonthlyAttendanceRecord | null>(null);

  useEffect(() => {
    try {
      const today = new Date();
      const startMonthDate = startOfMonth(today);
      const endMonthDate = endOfMonth(today);

      const generated = generateMonthlyAttendanceSummary(
        startMonthDate,
        endMonthDate,
        classroomGroups,
        attendanceData,
        holidays,
        today // pass today for better current-month handling
      );

      const currentMonthRecord = generated.find(
        (r) =>
          parseInt(r.monthOfYear) === today.getMonth() + 1 &&
          parseInt(r.year) === today.getFullYear()
      );

      setMonthlySummary(currentMonthRecord ?? null);
    } catch (err) {
      setMonthlySummary(null);
    }
  }, [attendanceData, classroomGroups, holidays]);

  return { monthlySummary };
}

function generateMonthlyAttendanceSummary(
  startMonth: Date,
  endMonth: Date,
  classroomGroups: ClassroomGroupDto[],
  allAttendance: AttendanceDto[],
  holidays: HolidayDto[],
  today: Date // new param
): MonthlyAttendanceRecord[] {
  if (!classroomGroups?.length) {
    return [];
  }

  const monthlyAttendance = new Map<string, Array<[number, number]>>();

  for (let dt = new Date(startMonth); dt <= endMonth; dt = addMonths(dt, 1)) {
    const monthKey = `${dt.getFullYear()}-${dt.getMonth() + 1}`;
    const attendanceTuples: Array<[number, number]> = [];

    for (const classroomGroup of classroomGroups) {
      const learners = classroomGroup.learners || [];

      for (const programme of classroomGroup.classProgrammes || []) {
        const validClassDays = getWorkingDays(
          dt.getFullYear(),
          dt.getMonth(),
          holidays
        );

        // For current month, allow days up to today (but don't exclude start day)
        const daysOfClass = calculateDaysOfClassForMonth(
          dt,
          programme.meetingDay,
          validClassDays,
          new Date(programme.programmeStartDate),
          today // use today instead of endMonth for current month
        );

        if (daysOfClass.length === 0 || learners.length === 0) continue;

        let attendedSessionCount = 0;

        for (const classDay of daysOfClass) {
          const hasLearnerAttendance = allAttendance.some((record) => {
            if (record.classroomProgrammeId !== programme.id) return false;
            if (!record.attendanceDate) return false;

            const isLearnerRecord = learners.some(
              (learner) => learner.childUserId === record.userId
            );
            if (!isLearnerRecord) return false;

            return isSameDay(
              normalizeToStartOfDay(classDay),
              normalizeToStartOfDay(record.attendanceDate)
            );
          });

          if (hasLearnerAttendance) attendedSessionCount++;
        }

        attendanceTuples.push([daysOfClass.length, attendedSessionCount]);
      }
    }

    if (attendanceTuples.length > 0) {
      monthlyAttendance.set(monthKey, attendanceTuples);
    }
  }

  return createReport(monthlyAttendance);
}

// createReport stays exactly the same as before
function createReport(
  monthlyAttendance: Map<string, Array<[number, number]>>
): MonthlyAttendanceRecord[] {
  const report: MonthlyAttendanceRecord[] = [];

  for (const [monthKey, tuples] of monthlyAttendance.entries()) {
    const [yearStr, monthStr] = monthKey.split('-');
    const totalScheduled = tuples.reduce((sum, t) => sum + t[0], 0);
    const actualAttended = tuples.reduce((sum, t) => sum + t[1], 0);
    console.log('totalScheduled', totalScheduled);
    console.log('actualAttended', actualAttended);

    const percentage =
      totalScheduled > 0
        ? Math.round((actualAttended / totalScheduled) * 100)
        : 0;

    report.push({
      monthOfYear: monthStr,
      month: new Date(parseInt(yearStr), parseInt(monthStr) - 1).toLocaleString(
        'default',
        { month: 'long' }
      ),
      year: yearStr,
      percentageAttendance: Math.min(100, Math.max(0, percentage)),
      numberOfSessions: actualAttended,
      totalScheduledSessions: totalScheduled,
    });
  }

  return report;
}
