import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  eachDayOfInterval,
  endOfWeek,
  isWeekend,
  isWithinInterval,
  startOfWeek,
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

export function getFirstFriday(startDate) {
  var resultDate = startDate;
  resultDate.setDate(startDate.getDate() + ((7 + 5 - startDate.getDay()) % 7));

  return resultDate;
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

export function numberToDayOfWeek(number: number, format?: 'long' | 'short') {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  let day = days[number];

  if (format === 'short') {
    day = day.substring(0, 3);
  }

  return day;
}

export function getFormattedDateInYearsMonthsAndDays(startedDate?: string) {
  if (!startedDate) return undefined;

  const { years, months, days } = getAgeInYearsMonthsAndDays(startedDate);

  if (!years && !months && !days) return 'Not provided';

  if (years === 0 && months < 1) {
    return `${days} ${days > 1 ? 'days' : 'day'}`;
  }

  if (years === 0) {
    return `${months} ${months > 1 ? 'months' : 'month'}`;
  }

  return `${years} ${years > 1 ? 'years' : 'year'} ${months} ${
    months > 1 ? 'months' : 'month'
  }`;
}

export const getDateWithoutTimeZone = (date: string) => {
  if (!date) return;

  const [dateWithoutTimeZoneString] = date?.split('T');

  if (dateWithoutTimeZoneString) {
    const dateWithoutTimeZone = new Date(dateWithoutTimeZoneString);
    dateWithoutTimeZone.setHours(0, 0, 0, 0);

    return dateWithoutTimeZone;
  }

  return undefined;
};

export const getPreviousMonth = (date: Date): Date => {
  // Get the month and year of the current date
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();

  // Calculate the month and year of the previous month
  let previousMonth = currentMonth - 1;
  let previousYear = currentYear;

  if (previousMonth < 0) {
    // If the previous month is negative, subtract 1 from the year and set the month to 11 (December)
    previousMonth = 11;
    previousYear -= 1;
  }

  // Create a new Date object for the first day of the previous month
  return new Date(previousYear, previousMonth, 1);
};

export const getNextMonth = (date: Date): Date => {
  // Get the month and year of the current date
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();

  // Calculate the month and year of the previous month
  let nextMonth = currentMonth + 1;
  let nextYear = currentYear;

  if (nextMonth > 11) {
    // If the previous month is negative, subtract 1 from the year and set the month to 11 (December)
    nextMonth = 0;
    nextYear += 1;
  }

  // Create a new Date object for the first day of the previous month
  return new Date(nextYear, nextMonth, 1);
};

/**
 * Function to get the business days of a week given a start date.
 * @param {Date} startDate - The initial date.
 * @returns {Date[]} - An array of business days.
 */
export const getBusinessDaysOfWeek = (startDate: Date) => {
  // Get the first and last day of the week based on the initial date
  const startOfWeekDate = startOfWeek(startDate, { weekStartsOn: 1 }); // Week starting on Monday
  const endOfWeekDate = endOfWeek(startDate, { weekStartsOn: 1 });

  // Get all days of the week
  const allDays = eachDayOfInterval({
    start: startOfWeekDate,
    end: endOfWeekDate,
  });

  // Filter to get only the business days
  const businessDays = allDays.filter((day) => !isWeekend(day));

  return businessDays;
};

export const isNextWeek = (date: Date) => {
  const startOfNextWeek = startOfWeek(addWeeks(new Date(), 1));
  const endOfNextWeek = endOfWeek(addWeeks(new Date(), 1));

  return isWithinInterval(date, { start: startOfNextWeek, end: endOfNextWeek });
};

export const getNextBusinessDay = (date: Date) => {
  let nextDay = addDays(date, 1);

  while (isWeekend(nextDay)) {
    nextDay = addDays(nextDay, 1);
  }

  return nextDay;
};
