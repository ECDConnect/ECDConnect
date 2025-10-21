import { useEffect, useState } from 'react';
import {
  AttendanceDto,
  HolidayDto,
  MonthlyAttendanceRecord,
} from '@ecdlink/core';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { endOfMonth, startOfMonth, addMonths } from 'date-fns';
import { getWorkingDays } from '@/utils/common/date.utils';
import { calculateDaysOfClassForMonth } from '@/utils/classroom/attendance/track-attendance-utils';

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

      const currentMonthData = attendanceData.filter(
        (x) =>
          x.monthOfYear === today.getMonth() + 1 &&
          x.year === today.getFullYear()
      );

      const generated = generateMonthlyAttendanceSummary(
        startMonthDate,
        endMonthDate,
        classroomGroups,
        currentMonthData,
        holidays
      );

      // ✅ Take only the first (or only) record
      setMonthlySummary(generated[0] ?? null);
    } catch (err) {
      console.log('setMonthlySummary', err);
    }
  }, [attendanceData, classroomGroups, holidays]);

  return { monthlySummary };
}

function generateMonthlyAttendanceSummary(
  startMonth: Date,
  endMonth: Date,
  classroomGroups: ClassroomGroupDto[],
  attendanceForPeriod: AttendanceDto[],
  holidays: HolidayDto[]
): MonthlyAttendanceRecord[] {
  if (!classroomGroups?.length || !attendanceForPeriod?.length) return [];

  const monthlyAttendance = new Map<Date, Array<[number, number]>>();

  for (
    let dt = new Date(startMonth);
    dt.getFullYear() < endMonth.getFullYear() ||
    (dt.getFullYear() === endMonth.getFullYear() &&
      dt.getMonth() <= endMonth.getMonth());
    dt = addMonths(dt, 1)
  ) {
    const attendance: Array<[number, number]> = [];

    for (const classroomGroup of classroomGroups) {
      const validClassDays = getWorkingDays(
        dt.getFullYear(),
        dt.getMonth(),
        holidays
      );
      const learners = classroomGroup.learners;

      for (const programme of classroomGroup.classProgrammes) {
        const daysOfClass = calculateDaysOfClassForMonth(
          dt,
          programme.meetingDay,
          validClassDays,
          new Date(programme.programmeStartDate),
          endMonth
        );

        if (daysOfClass.length > 0 && learners.length > 0) {
          const attendedClasses = attendanceForPeriod.filter(
            (x) =>
              x.classroomProgrammeId === programme.id &&
              //    new Date(x.attendanceDate!).getTime() >=
              //      new Date(programme.programmeStartDate).getTime() &&
              x.monthOfYear === dt.getMonth() + 1 &&
              x.year === dt.getFullYear() &&
              x.attended
          );

          const distinctProgrammeSessions = new Set(
            attendedClasses.map(
              (x) =>
                `${x.classroomProgrammeId}-${new Date(
                  x.attendanceDate!
                ).toDateString()}`
            )
          );
          attendance.push([daysOfClass.length, distinctProgrammeSessions.size]);
        }
      }
    }

    if (attendance.length > 0) {
      monthlyAttendance.set(new Date(dt), attendance);
    }
  }

  return createReport(monthlyAttendance);
}

function createReport(
  monthlyAttendance: Map<Date, Array<[number, number]>>
): MonthlyAttendanceRecord[] {
  const report: MonthlyAttendanceRecord[] = [];

  for (const [monthDate, tuples] of monthlyAttendance.entries()) {
    const totalAttendance = tuples.reduce((sum, t) => sum + t[0], 0);
    const actualAttendance = tuples.reduce((sum, t) => sum + t[1], 0);

    const reportPercentage =
      totalAttendance > 0
        ? Math.round((actualAttendance / totalAttendance) * 100)
        : 0;

    report.push({
      monthOfYear: (monthDate.getMonth() + 1).toString(),
      month: monthDate.toLocaleString('default', { month: 'long' }),
      year: monthDate.getFullYear().toString(),
      percentageAttendance: Math.min(100, Math.max(0, reportPercentage)),
      numberOfSessions: actualAttendance,
      totalScheduledSessions: totalAttendance,
    });
  }

  return report;
}
