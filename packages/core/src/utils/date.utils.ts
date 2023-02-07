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

export const getNextDateByDay = (daysLater: number, currentDate?: Date) => {
  const today = new Date();
  const date = new Date(currentDate || today);
  date.setDate(date.getDate() + daysLater);

  return date;
};
