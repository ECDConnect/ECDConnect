import {
  DailyProgrammeDto,
  HolidayDto,
  ProgrammeDto,
  ActivityDto,
} from '@ecdlink/core/';
import {
  areIntervalsOverlapping,
  endOfWeek,
  getDay,
  getWeek,
  Interval,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  startOfWeek,
  subDays,
} from 'date-fns';
import isAfter from 'date-fns/isAfter';
import { DateFormats } from '../../../constants/Dates';
import { DailyRoutineItemType } from '@enums/ProgrammeRoutineType';
import { ProgrammeWeek } from '@models/classroom/programme-planning/programme-types';
import { WeekDayBreakdown } from '../../../pages/classroom/programme-planning/components/week-tab/week-tab.types';
import { getDatesForRange, isDayInThePast } from '../../common/date.utils';
import { Weekdays } from '../../practitioner/playgroups-utils';

export const getProgrammeWeeks = (
  programme?: ProgrammeDto
): ProgrammeWeek[] => {
  if (!programme) return [];

  const weeks = programme.dailyProgrammes.reduce((prev, curr) => {
    let currentItemDate = new Date(curr.dayDate);
    const weekOfYear = getWeek(currentItemDate, { weekStartsOn: 1 });

    const existingIndex = prev.findIndex(
      (week) => week.weekNumber === weekOfYear
    );

    if (existingIndex < 0) {
      prev.push({
        startDate: startOfWeek(currentItemDate, { weekStartsOn: 1 }),
        endDate: subDays(endOfWeek(currentItemDate, { weekStartsOn: 1 }), 2), // subtract Sunday and Saterday,
        days: [curr],
        totalIncompleteDays: isProgrammeRoutineDayComplete(curr) ? 0 : 1,
        weekNumber: weekOfYear,
      });
      return prev;
    } else {
      const existingWeek = prev[existingIndex];

      existingWeek.days.push(curr);
      existingWeek.totalIncompleteDays = isProgrammeRoutineDayComplete(curr)
        ? existingWeek.totalIncompleteDays
        : existingWeek.totalIncompleteDays + 1;

      prev[existingIndex] = existingWeek;

      return prev;
    }
  }, [] as ProgrammeWeek[]);
  weeks.sort((a, b) => (a.endDate > b.endDate ? 1 : -1));
  return weeks;
};

export const isProgrammeRoutineDayComplete = (
  day?: DailyProgrammeDto
): boolean => {
  if (!day) return false;
  return (
    !!day.largeGroupActivityId &&
    !!day.smallGroupActivityId &&
    !!day.storyActivityId
  );
};

export const getProgrammeRoutineDay = (
  week: number,
  weekday: Weekdays,
  programme?: ProgrammeDto
): DailyProgrammeDto | undefined => {
  if (!programme) return;

  const programmeDay = programme.dailyProgrammes.find(
    (day) =>
      getWeek(new Date(day.dayDate)) === week &&
      getDay(new Date(day.dayDate)) === weekday
  );

  return programmeDay;
};

export const getProgrammeRoutineDayFromWeek = (
  date: Date,
  programmeWeek: ProgrammeWeek
): DailyProgrammeDto | undefined => {
  if (!programmeWeek) return;

  const programmeDay = programmeWeek.days.find((day) =>
    isSameDay(date, new Date(day.dayDate))
  );

  return programmeDay;
};

export const getDateRangeText = (
  dateFrom?: string | number | Date,
  dateTo?: string | number | Date
): string => {
  if (!dateFrom || !dateTo) return '';

  const dateFromAsDate = new Date(dateFrom);
  const dateToAsDate = new Date(dateTo);

  const sharesMonth = isSameMonth(dateFromAsDate, dateToAsDate);

  return `${dateFromAsDate.getDate()} ${
    !sharesMonth
      ? dateFromAsDate.toLocaleString('en-ZA', DateFormats.shortMonthName)
      : ''
  } to ${dateToAsDate.getDate()} ${dateToAsDate.toLocaleString(
    'en-ZA',
    DateFormats.shortMonthName
  )}`;
};

export const getActivityIdForRoutineItem = (
  routineItemName: string,
  day?: DailyProgrammeDto
): number | undefined => {
  if (!day) return;
  switch (routineItemName) {
    case DailyRoutineItemType.smallGroup:
      return day.smallGroupActivityId;
    case DailyRoutineItemType.largeGroup:
      return day.largeGroupActivityId;
    case DailyRoutineItemType.storyBook:
      return day.storyActivityId;
  }
  return;
};

export const getTotalIncompleteDaysInWeek = (programmeWeek: ProgrammeWeek) => {
  return programmeWeek.days.filter((day) => !isProgrammeRoutineDayComplete(day))
    .length;
};

export const getWeekBreakDown = (
  programmeWeek: ProgrammeWeek,
  holidays: HolidayDto[],
  programme?: ProgrammeDto
): WeekDayBreakdown[] => {
  if (!programmeWeek || !programme) return [];

  const datesOfWeek = getDatesForRange(
    new Date(programmeWeek.startDate),
    new Date(programmeWeek.endDate)
  );

  const weekbreakdown: WeekDayBreakdown[] = datesOfWeek.map((weekdayDate) => {
    const dayOfWeek = getDay(weekdayDate);

    const programmeDay = getProgrammeRoutineDayFromWeek(
      weekdayDate,
      programmeWeek
    );
    const isHoliday = holidays.some((holiday) =>
      isSameDay(new Date(holiday.day), weekdayDate)
    );
    const isPastDate =
      isDayInThePast(weekdayDate, new Date()) ||
      isDayInThePast(weekdayDate, new Date(programme.startDate));

    const isDateAfterEndDate = isDayInThePast(
      new Date(programme.endDate),
      weekdayDate
    );
    return {
      date: weekdayDate,
      programmeDay: programmeDay,
      weekDay: Weekdays[dayOfWeek].toString(),
      isCompleted: programmeDay
        ? isProgrammeRoutineDayComplete(programmeDay)
        : false,
      isHoliday: isHoliday,
      isDisabled: isPastDate || isDateAfterEndDate,
    };
  });

  return weekbreakdown;
};

export const findConflictingProgramme = (
  programmes: ProgrammeDto[],
  startDate: number | Date,
  endDate: number | Date,
  classroomGroupId: string
): ProgrammeDto | undefined => {
  return programmes.find((programme) => {
    return (
      programme.classroomGroupId === classroomGroupId &&
      (areIntervalsOverlapping(
        { start: startDate, end: endDate },
        {
          start: new Date(programme.startDate),
          end: new Date(programme.endDate),
        }
      ) ||
        isSameDay(startDate, new Date(programme.endDate)) ||
        isSameDay(endDate, new Date(programme.startDate)))
    );
  });
};

export const findConflictingProgrammes = (
  programmes: ProgrammeDto[],
  startDate: number | Date,
  endDate: number | Date
): ProgrammeDto[] => {
  return programmes.filter((programme) =>
    areIntervalsOverlapping(
      { start: startDate, end: endDate },
      { start: new Date(programme.startDate), end: new Date(programme.endDate) }
    )
  );
};

export const getProgrammeDaysForInterval = (
  interval: Interval,
  programme: ProgrammeDto
): DailyProgrammeDto[] => {
  if (!interval || !programme) return [];

  return programme.dailyProgrammes.filter(
    (progDay) =>
      isSameDay(new Date(progDay.dayDate), interval.start) ||
      isSameDay(new Date(progDay.dayDate), interval.end) ||
      isWithinInterval(new Date(progDay.dayDate), interval)
  );
};

export const refreshProgrammeDateRange = (
  programme: ProgrammeDto
): ProgrammeDto => {
  if (!programme) return programme;

  const sortedDays = programme.dailyProgrammes.sort((progA, progB) =>
    isAfter(new Date(progA.dayDate), new Date(progB.dayDate)) ? 1 : -1
  );

  if (sortedDays.length === 0) return programme;

  const firstDate = sortedDays[0];
  const lastDate = sortedDays[sortedDays.length - 1];

  programme.startDate = firstDate.dayDate;
  programme.endDate = lastDate.dayDate;

  return programme;
};

export const getRoutineItemType = (name: string) => {
  switch (name) {
    case DailyRoutineItemType.smallGroup:
      return DailyRoutineItemType.smallGroup;
    case DailyRoutineItemType.largeGroup:
      return DailyRoutineItemType.largeGroup;
    case DailyRoutineItemType.storyBook:
      return DailyRoutineItemType.storyBook;
    case DailyRoutineItemType.messageBoard:
      return DailyRoutineItemType.messageBoard;
    case DailyRoutineItemType.greeting:
      return DailyRoutineItemType.greeting;
    default:
      return DailyRoutineItemType.freePlay;
  }
};

export const getExistingProgrammeActivity = (
  activity: ActivityDto,
  programme?: ProgrammeDto
) => {
  if (!activity || !programme) return;

  let activityType: DailyRoutineItemType | undefined;
  switch (activity.type) {
    case DailyRoutineItemType.smallGroup:
      activityType = DailyRoutineItemType.smallGroup;
      break;
    case DailyRoutineItemType.largeGroup:
      activityType = DailyRoutineItemType.largeGroup;
      break;
    case DailyRoutineItemType.storyBook:
      activityType = DailyRoutineItemType.storyBook;
      break;
  }

  const existingProgrammeActivities = getProgrammeDayActivities(
    programme,
    activityType
  );

  const existingActivity = existingProgrammeActivities.find(
    (dayActivity) => dayActivity.activityId === activity.id
  );

  return existingActivity;
};

type ProgrammeDayActivity = {
  date: string;
  activityId: number;
};

export const getProgrammeDayActivities = (
  programme: ProgrammeDto,
  type?: DailyRoutineItemType
): ProgrammeDayActivity[] => {
  if (!programme) return [];

  if (!type) {
    return getAllProgrammeDayActivities(programme);
  }

  const programmeActivitiesForType = programme.dailyProgrammes.reduce(
    (prev: ProgrammeDayActivity[], curr: DailyProgrammeDto) => {
      switch (type) {
        case DailyRoutineItemType.smallGroup: {
          if (curr.smallGroupActivityId)
            prev.push({
              date: curr.dayDate,
              activityId: curr.smallGroupActivityId,
            });
          break;
        }
        case DailyRoutineItemType.largeGroup: {
          if (curr.largeGroupActivityId)
            prev.push({
              date: curr.dayDate,
              activityId: curr.largeGroupActivityId,
            });
          break;
        }
        case DailyRoutineItemType.storyBook: {
          if (curr.storyActivityId)
            prev.push({ date: curr.dayDate, activityId: curr.storyActivityId });
          break;
        }
      }

      return prev;
    },
    []
  );

  return programmeActivitiesForType;
};

export const getAllProgrammeDayActivities = (
  programme: ProgrammeDto
): ProgrammeDayActivity[] => {
  if (!programme) return [];

  const reducedActivities: ProgrammeDayActivity[] =
    programme.dailyProgrammes.reduce(
      (prev: ProgrammeDayActivity[], curr: DailyProgrammeDto) => {
        const dayActivities: ProgrammeDayActivity[] = [];

        if (curr.largeGroupActivityId) {
          dayActivities.push({
            date: curr.dayDate,
            activityId: curr.largeGroupActivityId,
          });
        }

        if (curr.smallGroupActivityId) {
          dayActivities.push({
            date: curr.dayDate,
            activityId: curr.smallGroupActivityId,
          });
        }

        if (curr.storyActivityId) {
          dayActivities.push({
            date: curr.dayDate,
            activityId: curr.storyActivityId,
          });
        }

        prev.push(...dayActivities);

        return prev;
      },
      []
    );

  return reducedActivities;
};

export const getSelectedActivityWarningText = (
  activity: ActivityDto,
  programme?: ProgrammeDto
) => {
  const existingProgrammeActivity = getExistingProgrammeActivity(
    activity,
    programme
  );

  if (!existingProgrammeActivity) return;

  return `You are already doing this activity on ${new Date(
    existingProgrammeActivity.date
  ).toLocaleString('en-ZA', DateFormats.dayWithLongMonthName)}.
      Remember to include many different activities in your programme!`;
};

export const getAllGroupActivityIds = (programme: ProgrammeDto) => {
  if (!programme) return [];

  const programmeDays = programme?.dailyProgrammes;

  const plannedActivities: number[] = [];

  programmeDays.forEach((x) => {
    if (x.largeGroupActivityId) {
      plannedActivities.push(x.largeGroupActivityId);
    }
    if (x.smallGroupActivityId) {
      plannedActivities.push(x.smallGroupActivityId);
    }
  });

  return plannedActivities;
};
