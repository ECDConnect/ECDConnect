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

/**
 * Returns all working days (Mon–Fri) in a given month and year,
 * excluding specified holidays.
 *
 * @param year - The full year (e.g., 2025)
 * @param month - The month index (0 = January, 11 = December)
 * @param holidays - Array of holiday dates (as Date objects or ISO strings)
 * @returns Array of Date objects representing working days
 */

export function getWorkingDays(
  year: number,
  month: number,
  holidays: HolidayDto[] = []
): Date[] {
  // Normalize holidays to ISO date strings for easy comparison
  const holidaySet = new Set(
    holidays.map((h) => new Date(h.day).toISOString().split('T')[0])
  );

  const workingDays: Date[] = [];

  // Get number of days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    // Use UTC midnight so that normalizeToStartOfDay (which reads UTC components)
    // returns the correct calendar day regardless of the browser's timezone offset.
    const date = new Date(Date.UTC(year, month, day));
    const dayOfWeek = date.getUTCDay(); // 0 = Sunday, 6 = Saturday

    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    // Skip holidays
    const isoDate = date.toISOString().split('T')[0];
    if (holidaySet.has(isoDate)) continue;

    workingDays.push(date);
  }

  return workingDays;
}

export function ToUtcDateString(date: Date): string {
  // Create a new UTC date using the same year, month, and day
  const utcDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  return utcDate.toISOString(); // e.g. "2025-10-02T00:00:00.000Z"
}
