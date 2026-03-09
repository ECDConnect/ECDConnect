import { useEffect, useState } from 'react';
import {
  AttendanceDto,
  ChildAttendanceOverallReportModel,
  ChildDto,
  HolidayDto,
} from '@ecdlink/core';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { MergedChildAttendanceOverallReportModel } from '@/utils/classroom/attendance/track-attendance-utils';
import { getWorkingDays, ToUtcDateString } from '@/utils/common/date.utils';
import { format } from 'date-fns';

export function useMonthlyAttendanceReport(
  attendanceData: AttendanceDto[],
  classroomGroups: ClassroomGroupDto[],
  children: ChildDto[],
  holidays: HolidayDto[]
) {
  const [currentMonthAttendanceReport, setCurrentMonthAttendanceReport] =
    useState<MergedChildAttendanceOverallReportModel[] | null>(null);

  useEffect(() => {
    try {
      const today = new Date();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();

      // Filter for current month data
      const currentMonthData = attendanceData.filter(
        (x) => x.monthOfYear === month && x.year === year
      );

      // Get unique program IDs and filter classroom groups
      const uniqueProgramIds = currentMonthData.map(
        (x) => x.classroomProgrammeId
      );
      const filteredClassroomGroups = classroomGroups.filter((group) =>
        group.classProgrammes.some((programme) =>
          uniqueProgramIds.includes(programme.id)
        )
      );

      const validClassDays = getWorkingDays(year, month - 1, holidays);

      // Generate merged reports for each filtered classroom group
      const mergedReports: MergedChildAttendanceOverallReportModel[] =
        filteredClassroomGroups.map((group) => {
          // Filter all applicable programme Ids
          const classProgammeIds = group.classProgrammes.map((x) => x.id);
          const classProgrammeAttendance = currentMonthData.filter((x) =>
            classProgammeIds.includes(x.classroomProgrammeId)
          );
          // Filter all applicable children user Ids
          const classChildrenIds = classProgrammeAttendance.map(
            (x) => x.userId
          );
          const classProgrammeChildren = children.filter((x) =>
            classChildrenIds.includes(x.userId)
          );
          // Find attendance items for this classroom group
          const items: ChildAttendanceOverallReportModel[] =
            getChildAttendanceData(
              classProgrammeAttendance,
              classProgrammeChildren,
              validClassDays,
              month,
              year
            );

          return {
            classroomGroup: group,
            classroomGroupId: group.id,
            items,
          };
        });

      setCurrentMonthAttendanceReport(mergedReports);
    } catch (err) {
      console.error('Monthly Attendance Report Error', err);
      setCurrentMonthAttendanceReport(null);
    }
  }, [attendanceData, classroomGroups]);

  return { currentMonthAttendanceReport };
}

function getChildAttendanceData(
  classProgrammesAttendance: AttendanceDto[],
  classProgrammeChildren: ChildDto[],
  validClassDays: Date[],
  month: number,
  year: number
): ChildAttendanceOverallReportModel[] {
  const attendance: ChildAttendanceOverallReportModel[] = [];

  classProgrammeChildren.forEach((child) => {
    const userId = child?.userId || child.user?.id || '';
    const childAttendance = classProgrammesAttendance.filter(
      (x) => x.userId === userId
    );

    const classesAttented = validClassDays.map((classDay) => ({
      key: Number(format(classDay, 'dd')),
      value: childAttendance.filter(
        (x) =>
          x.attended &&
          ToUtcDateString(classDay).slice(0, 10) ===
            x.attendanceDate?.toString().slice(0, 10)
      ).length,
    }));

    const totalActual = classesAttented
      .map((x) => x.value)
      .reduce((sum, value) => sum + value, 0);
    const totalExpected = childAttendance.length;
    const totalPercentage =
      totalExpected > 0 ? Math.round((totalActual / totalExpected) * 100) : 0;

    attendance.push({
      attendance: classesAttented,
      attendancePercentage: totalPercentage,
      childFullName:
        child?.user?.fullName ||
        `${child?.user?.firstName ?? ''} ${child?.user?.surname ?? ''}`.trim(),
      childUserId: userId,
      month: month,
      totalActualAttendance: totalActual,
      totalExpectedAttendance: totalExpected,
      year: year,
      classgroupId: '',
    });
  });

  return attendance;
}
