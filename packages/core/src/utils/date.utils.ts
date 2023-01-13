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
