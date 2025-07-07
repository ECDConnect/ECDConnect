import { HolidayDto } from '@ecdlink/core';
import {
  addDays,
  getDayOfYear,
  getYear,
  intervalToDuration,
  isBefore,
  isSameDay,
  isWeekend,
  parseISO,
  getQuarter,
} from 'date-fns';

const dateLongMonthOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export const isWorkingDay = (date: Date, holidays: HolidayDto[]) => {
  const holidaysAsDaysOfYears = holidays.map((x) =>
    getDayOfYear(parseISO(x.day))
  );

  const dateDayOfYear = getDayOfYear(date);

  if (isWeekend(date)) return false;

  if (holidaysAsDaysOfYears.includes(dateDayOfYear)) return false;

  return true;
};

export const getDatesForRange = (
  startDate: number | Date,
  endDate: number | Date
): Date[] => {
  let now = startDate,
    dates: Date[] = [];

  while (isBefore(now, endDate) || isSameDay(now, endDate)) {
    dates.push(new Date(now));
    now = addDays(now, 1);
  }
  return dates;
};

export const isDayInThePast = (dateToCompare: Date, date: Date) => {
  const [dateToCompareDayOfYear, dateDayOfyear, dateToCompareYear, dateYear] = [
    getDayOfYear(dateToCompare),
    getDayOfYear(date),
    getYear(dateToCompare),
    getYear(date),
  ];

  return (
    dateToCompareDayOfYear < dateDayOfyear && dateToCompareYear <= dateYear
  );
};

export const calculateFullAge = (dob: Date) => {
  const { years, months, days } = intervalToDuration({
    start: dob,
    end: new Date(),
  });
  return { years: years ?? 0, months: months ?? 0, days: days ?? 0 };
};

export const formatDateLong = (date: Date) => {
  return new Date(date).toLocaleDateString('en-ZA', dateLongMonthOptions);
};

export const getQuarterMonths = (date: Date) => {
  const quarter = getQuarter(date);
  if (quarter === 1) {
    return 'Jan to March';
  }
  if (quarter === 2) {
    return 'April to June';
  }
  if (quarter === 3) {
    return 'July to September';
  } else {
    return 'October to December';
  }
};

export const differenceInMonths = (d1: Date, d2: Date) => {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
};
