import { Age } from '@models/common/Age';
import {
  differenceInYears,
  differenceInMonths,
  getMonth,
  isAfter,
  format,
  getYear,
  getWeek,
} from 'date-fns';
import {
  AttendanceDto,
  ClassProgrammeDto,
  getWeeksDiff,
  NoteDto,
} from '@ecdlink/core';
import { ChildAttendancePercentageReport } from '@models/classroom/progress-observation/ChildAttendancePercentageReport';
import { ReportingPeriod } from '@models/classroom/progress-observation/ReportingPeriod';

export const getAge = (dateOfBirth?: Date): Age => {
  if (!dateOfBirth) return { years: 0, months: 0 };

  const years = differenceInYears(new Date(), dateOfBirth);
  const diffInMonths = differenceInMonths(new Date(), dateOfBirth);

  const months = diffInMonths - years * 12;

  return {
    years,
    months,
  };
};

export const hasMonthPassed = (date: Date | undefined): boolean => {
  if (!date) return false;

  const monthsPassed = differenceInMonths(new Date(), date);

  return monthsPassed >= 1;
};

export const isInReportPeriod = (reportingPeriod: string, date: Date) => {
  if (reportingPeriod === 'First') return true;

  const currentMonth = date.getMonth();
  if (reportingPeriod === 'June') {
    return currentMonth === 5 || currentMonth === 6;
  }
  if (reportingPeriod === 'November') {
    return currentMonth === 10 || (currentMonth === 11 && date.getDate() <= 20);
  }
  return false;
};

export const isInReportPeriodDates = (reportingPeriod: string, date: Date) => {
  if (reportingPeriod === 'First') return [];

  const currentMonth = date.getMonth();
  if (reportingPeriod === 'June') {
    if (currentMonth === 5 || currentMonth === 6)
      return [
        new Date(date.getFullYear(), 5, 1),
        new Date(date.getFullYear(), 6, 31),
      ];
  }
  if (reportingPeriod === 'November') {
    if (currentMonth === 10 || (currentMonth === 11 && date.getDate() <= 20))
      return [
        new Date(date.getFullYear(), 10, 1),
        new Date(date.getFullYear(), 11, 20),
      ];
  }
  return [];
};

export const isInFinalMonthOfReportingPeriod = (
  reportingPeriod: string,
  date: Date
) => {
  if (reportingPeriod === 'First') return true;

  const currentMonth = date.getMonth();

  if (reportingPeriod === 'June') {
    const isJuly = currentMonth === 6;
    if (isJuly) return true;
    return false;
  }

  if (reportingPeriod === 'November') {
    const isDecember = currentMonth === 11;
    if (!isDecember) return false;
    const currentDay = date.getDate();
    return currentDay <= 20;
  }

  return false;
};

export const finalMonthOfReportingPeriodDueDate = (
  reportingPeriod: string,
  date: Date
) => {
  if (reportingPeriod === 'First') return undefined;

  const currentMonth = date.getMonth();

  if (reportingPeriod === 'June') {
    const isJuly = currentMonth === 6;
    if (isJuly) return new Date(date.getFullYear(), 6, 31);
    return false;
  }

  if (reportingPeriod === 'November') {
    const isDecember = currentMonth === 11;
    if (!isDecember) return undefined;
    return new Date(date.getFullYear(), 11, 20);
  }

  return undefined;
};

export const getFollowingReportingPeriod = (
  reportDate: Date
): ReportingPeriod => {
  const [reportingPeriod, reportingYear] = [
    getReportingPeriod(reportDate),
    getYear(reportDate),
  ];

  if (reportingPeriod.monthName === 'June') {
    return {
      monthName: 'November',
      year: reportingYear,
    };
  }

  return {
    monthName: 'June',
    year: reportingYear + 1,
  };
};

export const getReportingPeriod = (
  date: Date,
  firstObservation?: boolean
): ReportingPeriod => {
  const [month, year] = [getMonth(date), getYear(date)];

  if (firstObservation === true || (year === 2000 && month === 0)) {
    return {
      monthName: 'First',
      year,
    };
  }

  if (month <= 5)
    return {
      monthName: 'June',
      year,
    };

  return {
    monthName: 'November',
    year,
  };
};

export const getReportingPeriodDateInReportDate = (date: Date) => {
  const year = getYear(date);
  if (
    new Date(year, 5, 1).getTime() <= date.getTime() &&
    date.getTime() <= new Date(year, 6, 31).getTime()
  ) {
    return {
      monthName: 'June',
      year,
      reportingDate: new Date(year, 5, 1),
    };
  }
  if (
    new Date(year, 10, 1).getTime() <= date.getTime() &&
    date.getTime() <= new Date(year, 11, 20).getTime()
  ) {
    return {
      monthName: 'November',
      year,
      reportingDate: new Date(year, 10, 1),
    };
  }
};

export const getReportingPeriodForProfileUsePhotoInReport = (date: Date) => {
  const year = getYear(date);
  if (
    new Date(year, 7, 1).getTime() <= date.getTime() &&
    date.getTime() <= new Date(year, 11, 20).getTime()
  ) {
    return {
      monthName: 'November',
      year,
      reportingDate: new Date(year, 5, 1),
    };
  }
  return {
    monthName: 'June',
    year,
    reportingDate: new Date(year, 10, 1),
  };
};

export const isMatchingReportingPeriods = (dateLeft: Date, dateRight: Date) => {
  const periodLeft = getReportingPeriod(dateLeft);
  const periodRight = getReportingPeriod(dateRight);
  return (
    periodLeft.year === periodRight.year &&
    periodLeft.monthName === periodRight.monthName
  );
};

export const getChildAttendancePercentageAtPlaygroup = (
  childUserId: string,
  attendance: AttendanceDto[],
  classroomGroupId: string,
  classProgrammes: ClassProgrammeDto[],
  userRole: 'coach' | 'practitioner' = 'practitioner'
): ChildAttendancePercentageReport => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const lastWeek = getWeek(currentDate) - 1;
  const lastMonth = getMonth(currentDate);

  const firstDayOfLastMonth = new Date(`${currentYear}-${lastMonth}-1`);
  const lastDayOfLastMonth = new Date(currentYear, lastMonth, 0);

  const filteredProgrammes = classProgrammes.filter(
    (x) => x.classroomGroupId === classroomGroupId
  );
  const filteredProgrammesIds = filteredProgrammes.map((x) => x.id);

  const filteredProgrammesWeeks = filteredProgrammes.map((item) => {
    const startedLastMonth =
      new Date(item.programmeStartDate).getMonth() + 1 === lastMonth;

    return getWeeksDiff(
      startedLastMonth
        ? new Date(item.programmeStartDate)
        : firstDayOfLastMonth,
      lastDayOfLastMonth
    );
  });

  const totalOfDays = filteredProgrammesWeeks.reduce(
    (accumulator, value) => accumulator + value,
    0
  );

  // TODO: figure out how the attendance is created
  let attendanceRecords = attendance.filter(
    (x) =>
      filteredProgrammesIds.includes(x.classroomProgrammeId!) &&
      x.userId === childUserId &&
      ((userRole === 'coach' && x.monthOfYear === lastMonth) ||
        (userRole === 'practitioner' && x.weekOfYear === lastWeek))
  );

  const attendedCount = attendanceRecords.filter(
    (attendanceRecord) => attendanceRecord.attended
  ).length;

  const percentage = (attendedCount / (attendanceRecords.length || 1)) * 100;

  return {
    daysAttended: attendedCount,
    daysExpected:
      userRole === 'coach' ? totalOfDays : filteredProgrammes.length,
    percentage,
  };
};

export const getLastNoteDate = (notes: NoteDto[]) => {
  if (!notes) return '';

  const sortedNotes = notes.sort((noteA, noteB) => {
    return isAfter(new Date(noteA.insertedDate), new Date(noteB.insertedDate))
      ? 1
      : -1;
  });

  if (sortedNotes.length > 0) {
    const lastInsertedNoted = sortedNotes[0];
    return format(new Date(lastInsertedNoted.insertedDate), 'dd MMM yyyy');
  }

  return '';
};
