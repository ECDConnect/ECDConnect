import {
  DailyProgrammeDto,
  ProgrammeDto,
  ProgrammeThemeDto,
  getBusinessDaysOfWeek,
  sortDateFunction,
} from '@ecdlink/core';
import {
  addDays,
  addWeeks,
  differenceInBusinessDays,
  formatISO,
  isAfter,
  isFriday,
  isSameDay,
  isWeekend,
  parseISO,
  subWeeks,
} from 'date-fns';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@store';
import { classroomsSelectors } from '@store/classroom';
import { programmeActions, programmeSelectors } from '@store/programme';
import { practitionerSelectors } from '@store/practitioner';
import {
  findConflictingProgramme,
  findConflictingProgrammes,
  getProgrammeDaysForInterval,
  refreshProgrammeDateRange,
} from '@utils/classroom/programme-planning/programmes.utils';
import { newGuid } from '@utils/common/uuid.utils';
import { useHolidays } from './useHolidays';
import { cloneDeep } from 'lodash';

type DailyProgrammesCreateResult = {
  dailyProgrammes: DailyProgrammeDto[];
  endDate: number | Date;
};

export const useProgrammePlanning = () => {
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const programmes = useSelector(programmeSelectors.getProgrammes);
  const holiday = useHolidays();
  const dispatch = useAppDispatch();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const practitionerClassroomGroups = classroomGroups?.filter((item: any) => {
    return item?.userId === practitioner?.userId;
  });

  const createOrEditProgramme = async (
    classroomGroupId: string,
    startDate: Date,
    language: string,
    theme?: ProgrammeThemeDto,
    endDate?: Date,
    programme?: ProgrammeDto
  ): Promise<ProgrammeDto> => {
    const newProgramme: ProgrammeDto = {
      id: programme?.id || newGuid(),
      insertedDate: formatISO(new Date()),
      classroomId:
        classroom?.id || practitionerClassroomGroups?.at(0)?.classroomId || '',
      name: theme?.name || 'No theme',
      preferredLanguage: language,
      startDate: startDate.toISOString(),
      endDate: endDate?.toISOString() || '',
      dailyProgrammes: [],
      classroomGroupId: classroomGroupId,
    };

    const dailyProgrammesResult = createProgrammeDailyProgrammes(
      newProgramme,
      startDate,
      theme
    );

    newProgramme.endDate = new Date(
      dailyProgrammesResult.endDate
    ).toISOString();
    newProgramme.dailyProgrammes = dailyProgrammesResult.dailyProgrammes;

    clearOverlappingDaysProgrammes(newProgramme, classroomGroupId);

    if (!!programme) {
      dispatch(
        programmeActions.updateProgrammes({
          programme: {
            ...newProgramme,
            dailyProgrammes: [
              ...newProgramme.dailyProgrammes,
              ...programme.dailyProgrammes?.map((day) => ({
                ...day,
                isActive: false,
              })),
            ],
          },
        })
      );
    } else {
      dispatch(programmeActions.createProgramme(newProgramme));
    }

    return newProgramme;
  };

  const validateStartDate = (startDate: Date): Date => {
    const isStartDateUnattendable =
      isWeekend(startDate) || holiday.isHoliday(startDate);

    if (isStartDateUnattendable) {
      startDate = getNextValidDate(startDate);
    }

    return startDate;
  };

  const getNoThemedProgrammeEndDate = (startDate: Date) => {
    const validStartDate = validateStartDate(startDate);
    let endDate = validStartDate;
    let isLastWorkdayOfWeek = isFriday(endDate);
    let totalDays = 1;
    while (!isLastWorkdayOfWeek) {
      endDate = addDays(endDate, 1);
      totalDays = !holiday.isHoliday(endDate) ? totalDays + 1 : totalDays;
      isLastWorkdayOfWeek = isFriday(endDate);
    }

    return {
      endDate,
      totalDays,
    };
  };

  const getThemedProgrammeEndDate = (startDate: Date) => {
    const validStartDate = validateStartDate(startDate);
    let daysChecked = 1;
    let endDate = validStartDate;
    while (daysChecked < 20) {
      endDate = getNextValidDate(endDate);
      daysChecked += 1;
    }

    return endDate;
  };

  const getNextValidDate = (date: Date): Date => {
    date = addDays(date, 1);

    while (isWeekend(date) || holiday.isHoliday(date)) {
      date = addDays(date, 1);
    }

    return date;
  };

  const getConflictingProgramme = (
    startDate: Date,
    endDate: Date,
    classroomGroupId: string
  ) => {
    return findConflictingProgramme(
      programmes,
      startDate,
      endDate,
      classroomGroupId
    );
  };

  const createProgrammeDailyProgrammes = (
    programme: ProgrammeDto,
    startDate: Date,
    theme?: ProgrammeThemeDto
  ): DailyProgrammesCreateResult => {
    if (theme) {
      return createDailyProgrammesForTheme(programme, startDate, theme);
    } else {
      return createDailyProgrammesForNoTheme(programme, startDate);
    }
  };

  const createDailyProgrammesForTheme = (
    programme: ProgrammeDto,
    startDate: Date,
    theme: ProgrammeThemeDto
  ): any => {
    let dayDate = startDate;
    let endDate = startDate;

    const dailyProgrammes: DailyProgrammeDto[] = [];
    let themeDay = 1;

    // get total holidays for period to be subtracted from business days
    const totalHolidays = holiday.holidays.filter((item) => {
      let date = new Date(item.day);
      return date >= startDate && date <= new Date(programme?.endDate);
    }).length;

    const diffDays =
      differenceInBusinessDays(new Date(programme?.endDate), startDate) -
      totalHolidays;

    while (dailyProgrammes.length <= diffDays) {
      if (dailyProgrammes.length > 0) {
        dayDate = getNextValidDate(dayDate);
      }

      dailyProgrammes.push({
        id: newGuid(),
        day: themeDay.toString(),
        dayDate: dayDate.toISOString(),
        programmeId: programme.id ?? '',
        messageBoardText: '',
      });
      themeDay += 1;
      endDate = isAfter(dayDate, endDate) ? dayDate : endDate;
    }

    const themeAppliedDailyProgrammes = [];
    for (const dailyProg of dailyProgrammes) {
      const day = +dailyProg.day;
      const thDay = theme.themeDays.find((x) => +x.day === day);

      if (thDay) {
        dailyProg.largeGroupActivityId =
          thDay.largeGroupActivity.length > 0
            ? thDay.largeGroupActivity[0].id
            : 0;
        dailyProg.smallGroupActivityId =
          thDay.smallGroupActivity.length > 0
            ? thDay.smallGroupActivity[0].id
            : 0;
        dailyProg.storyActivityId =
          thDay.storyActivity.length > 0 ? thDay.storyActivity[0].id : 0;
        dailyProg.storyBookId =
          thDay.storyBook.length > 0 ? thDay.storyBook[0].id : 0;
      }

      themeAppliedDailyProgrammes.push(dailyProg);
    }

    return {
      dailyProgrammes: themeAppliedDailyProgrammes,
      endDate,
    };
  };

  const createDailyProgrammesForNoTheme = (
    programme: ProgrammeDto,
    startDate: Date
  ) => {
    let dayDate = startDate;
    // let endDateResult = getNoThemedProgrammeEndDate(startDate);
    let endDateResult = getNoThemedProgrammeEndDate(startDate);
    const dailyProgrammes: DailyProgrammeDto[] = [];

    // get total holidays for period to be subtracted from business days
    const totalHolidays = holiday.holidays.filter((item) => {
      let date = new Date(item.day);
      return date >= startDate && date <= new Date(programme?.endDate);
    }).length;

    const diffDays =
      differenceInBusinessDays(new Date(endDateResult.endDate), startDate) -
      totalHolidays;
    let themeDay = 1;

    while (dailyProgrammes.length <= diffDays) {
      if (dailyProgrammes.length > 0) {
        dayDate = getNextValidDate(dayDate);
      }

      dailyProgrammes.push({
        id: newGuid(),
        day: themeDay.toString(),
        dayDate: dayDate.toISOString(),
        programmeId: programme.id ?? '',
        messageBoardText: '',
        isActive: true,
      });
      themeDay += 1;
    }

    return {
      dailyProgrammes,
      endDate: endDateResult.endDate,
    };
  };

  const clearOverlappingDaysProgrammes = (
    newPrograme: ProgrammeDto,
    classroomGroupId: string
  ) => {
    const newProgrammeStartDate = new Date(newPrograme.startDate);
    const newProgrammeEndDate = new Date(newPrograme.endDate);

    const classroomProgrammes = programmes.filter(
      (x) => x.classroomGroupId === classroomGroupId
    );
    const conflictingProgrammes = findConflictingProgrammes(
      classroomProgrammes,
      newProgrammeStartDate,
      newProgrammeEndDate
    );

    if (conflictingProgrammes) {
      for (const conflictingProgramme of conflictingProgrammes) {
        let conflictingProgrammeCopy = cloneDeep(conflictingProgramme);
        const overlappingDays = getProgrammeDaysForInterval(
          { start: newProgrammeStartDate, end: newProgrammeEndDate },
          conflictingProgrammeCopy
        );
        const nonConflictingDays =
          conflictingProgrammeCopy.dailyProgrammes.filter(
            (dailyProg) =>
              !overlappingDays.some(
                (overlappingDay) => overlappingDay.day === dailyProg.day
              )
          );
        const sortedDays = nonConflictingDays.sort((a, b) =>
          sortDateFunction(new Date(a.dayDate), new Date(b.dayDate))
        );

        conflictingProgrammeCopy.dailyProgrammes = nonConflictingDays;

        if (sortedDays.length > 0) {
          conflictingProgrammeCopy.startDate = sortedDays[0].dayDate;
          conflictingProgrammeCopy.endDate =
            sortedDays[sortedDays.length - 1].dayDate;
        }

        conflictingProgrammeCopy = refreshProgrammeDateRange(
          conflictingProgrammeCopy
        );

        dispatch(
          programmeActions.updateProgrammes({
            programme: conflictingProgrammeCopy,
          })
        );
      }
    }
  };

  const findDailyProgrammesByDate = (
    programmes: ProgrammeDto[],
    dates: Date[]
  ) => {
    return dates.map((date) => {
      for (const programme of programmes) {
        const match = programme.dailyProgrammes.find((dp) =>
          isSameDay(parseISO(dp.dayDate), date)
        );
        if (match) {
          return { date, dailyProgramme: match };
        }
      }
      return { date, dailyProgramme: null }; // No match found
    });
  };

  const checkIfWholeWeekIsPlanned = (
    selectedDate: Date,
    classroomGroupId: string
  ) => {
    const classroomGroupProgrammes = programmes.filter(
      (programme) => programme.classroomGroupId === classroomGroupId
    );

    const businessDaysOfWeek = getBusinessDaysOfWeek(selectedDate)?.filter(
      (day) => !holiday.isHoliday(day)
    );

    const dailyProgrammesByDate = findDailyProgrammesByDate(
      classroomGroupProgrammes,
      businessDaysOfWeek
    );

    const dailyProgrammesUnplanned = dailyProgrammesByDate.filter(
      ({ dailyProgramme }) =>
        !dailyProgramme?.smallGroupActivityId ||
        !dailyProgramme?.storyActivityId ||
        !dailyProgramme?.largeGroupActivityId
    );

    return {
      dailyProgrammesByDate,
      dailyProgrammesUnplanned,
      isWholeWeekPlanned: dailyProgrammesByDate.every(
        ({ dailyProgramme }) =>
          !!dailyProgramme?.smallGroupActivityId &&
          !!dailyProgramme?.storyActivityId &&
          !!dailyProgramme?.largeGroupActivityId
      ),
    };
  };

  const getPlannedWeeksCount = (
    currentDate: Date,
    classroomGroupId: string
  ) => {
    let plannedWeeksCount = 0;
    const weeksStartDates: Date[] = [];

    const checkWeeks = (date: Date, direction: 'forward' | 'backward') => {
      let currentWeekStartDate = date;
      while (true) {
        const { isWholeWeekPlanned } = checkIfWholeWeekIsPlanned(
          currentWeekStartDate,
          classroomGroupId
        );
        if (!isWholeWeekPlanned) {
          break;
        }

        plannedWeeksCount++;
        weeksStartDates.push(currentWeekStartDate);
        currentWeekStartDate =
          direction === 'forward'
            ? addWeeks(currentWeekStartDate, 1)
            : subWeeks(currentWeekStartDate, 1);
      }
    };

    // Check the current week
    const { isWholeWeekPlanned: isCurrentWeekPlanned } =
      checkIfWholeWeekIsPlanned(currentDate, classroomGroupId);

    if (isCurrentWeekPlanned) {
      plannedWeeksCount++;
      weeksStartDates.push(currentDate);
    } else {
      return { plannedWeeksCount, weeksStartDates };
    }

    // Check future weeks
    checkWeeks(addWeeks(currentDate, 1), 'forward');

    // Check past weeks
    checkWeeks(subWeeks(currentDate, 1), 'backward');

    return { plannedWeeksCount, weeksStartDates };
  };

  return {
    createOrEditProgramme,
    getConflictingProgramme,
    validateStartDate,
    getThemedProgrammeEndDate,
    getNoThemedProgrammeEndDate,
    checkIfWholeWeekIsPlanned,
    getPlannedWeeksCount,
  };
};
