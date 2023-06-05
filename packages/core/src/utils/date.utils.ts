import {
  addMonths,
  addYears,
  differenceInCalendarMonths,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from 'date-fns';

export function getWeeksDiff(startDate: Date, endDate: Date) {
  const msInWeek = 1000 * 60 * 60 * 24 * 7;

  return Math.round(
    Math.abs(endDate.valueOf() - startDate.valueOf()) / msInWeek
  );
}

export function getWeekDate(
  dayName: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'
) {
  const weekDay = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
  };

  const currentDay = weekDay[dayName];

  const date = new Date();
  var day = date.getDay();

  date.setHours(-24 * (day - currentDay));
  return date;
}

export function getPreviousAndNextMonths(
  currentDate: Date | string,
  period: number
) {
  const monthsAgo = new Date(currentDate);
  const monthsLater = new Date(currentDate);

  const previousDate = new Date(
    monthsAgo.setMonth(monthsAgo.getMonth() - period)
  );
  const nextDate = new Date(
    monthsLater.setMonth(monthsLater.getMonth() + period)
  );

  return { previousDate, nextDate };
}

export const monthsList = [
  { label: 'January', value: '1' },
  { label: 'February', value: '2' },
  { label: 'March', value: '3' },
  { label: 'April', value: '4' },
  { label: 'May', value: '5' },
  { label: 'June', value: '6' },
  { label: 'July', value: '7' },
  { label: 'August', value: '8' },
  { label: 'September', value: '9' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
];

export const getNextDateByDay = (daysLater: number, currentDate?: Date) => {
  const today = new Date();
  const date = new Date(currentDate || today);
  date.setDate(date.getDate() + daysLater);

  return date;
};

export function getAgeInYearsMonthsAndDays(birthdate: string) {
  const birthDateObj = new Date(birthdate);
  const currentDate = new Date();

  const years = differenceInYears(currentDate, birthDateObj);
  const afterYears = addYears(birthDateObj, years);

  const months = differenceInMonths(currentDate, afterYears);
  const afterMonths = addMonths(afterYears, months);

  const days = differenceInDays(currentDate, afterMonths);

  return { years, months, days };
}
