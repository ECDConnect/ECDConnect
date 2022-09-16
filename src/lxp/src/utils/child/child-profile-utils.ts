import { Age } from '@models/common/Age';
import {
  differenceInYears,
  differenceInMonths,
  isFirstDayOfMonth,
  getMonth,
  isAfter,
  format,
  getYear,
} from 'date-fns';
import { AttendanceDto, ClassProgrammeDto, NoteDto } from '@ecdlink/core';
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

export const isReportDue = (date: Date) => {
  const currentDate = date;
  const currentMonth = currentDate.getMonth();
  const isFirstOfMonth = isFirstDayOfMonth(currentDate);
  const isJulyOrDecember = currentMonth === 6 || currentMonth === 11;

  return isJulyOrDecember && isFirstOfMonth;
};

export const isInFinalMonthOfReportingPeriod = (date: Date) => {
  const currentMonth = date.getMonth();

  const isJuly = currentMonth === 6;
  const isDecember = currentMonth === 11;

  if (isJuly) return true;

  if (!isDecember) return false;

  const currentDay = date.getDate();

  return currentDay <= 20;
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

export const getReportingPeriod = (date: Date): ReportingPeriod => {
  const [month, year] = [getMonth(date), getYear(date)];

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

export const isMatchingReportingPeriods = (dateLeft: Date, dateRight: Date) => {
  const [dateLeftYear, dateRightYear] = [getYear(dateLeft), getYear(dateRight)];

  const [dateLeftReportingPeriod, dateRightReportingPeriod] = [
    getReportingPeriod(dateLeft),
    getReportingPeriod(dateRight),
  ];

  return (
    dateLeftYear === dateRightYear &&
    dateLeftReportingPeriod.monthName === dateRightReportingPeriod.monthName
  );
};

export const getReportingPeriodNumber = (date: Date): number => {
  const month = getMonth(date);

  if (month <= 5) return 6;

  return 11;
};

export const getChildAttendancePercentageAtPlaygroup = (
  childUserId: string,
  attendance: AttendanceDto[],
  classroomGroupId: string,
  classProgrammes: ClassProgrammeDto[]
): ChildAttendancePercentageReport => {
  const filteredProgrammes = classProgrammes.filter(
    (x) => x.classroomGroupId === classroomGroupId
  );
  const filteredProgrammesIds = filteredProgrammes.map((x) => x.id);

  // TODO: figure out how the attendance is created
  let attendanceRecords = attendance.filter(
    (x) =>
      filteredProgrammesIds.includes(x.classroomProgrammeId) &&
      x.userId === childUserId
  );

  const attendedCount = attendanceRecords.filter(
    (attendanceRecord) => attendanceRecord.attended
  ).length;

  const percentage = (attendedCount / (attendanceRecords.length || 1)) * 100;

  return {
    daysAttended: attendedCount,
    daysExpected: filteredProgrammes.length,
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
