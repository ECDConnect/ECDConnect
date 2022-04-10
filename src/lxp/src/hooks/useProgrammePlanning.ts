import {
  DailyProgrammeDto,
  ProgrammeDto,
  ProgrammeThemeDto,
  sortDateFunction,
} from '@ecdlink/core';
import { addDays, isAfter, isFriday, isWeekend } from 'date-fns';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@store';
import { classroomsSelectors } from '@store/classroom';
import { programmeActions, programmeSelectors } from '@store/programme';
import {
  findConflictingProgramme,
  getProgrammeDaysForInterval,
  refreshProgrammeDateRange,
} from '../utils/classroom/programme-planning/programmes.utils';
import { newGuid } from '../utils/common/uuid.utils';
import { useHolidays } from './useHolidays';

type DailyProgrammesCreateResult = {
  dailyProgrammes: DailyProgrammeDto[];
  endDate: number | Date;
};

export const useProgrammePlanning = () => {
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const programmes = useSelector(programmeSelectors.getProgrammes);
  const holiday = useHolidays();
  const dispatch = useAppDispatch();

  const createProgramme = async (
    startDate: Date,
    language: string,
    theme?: ProgrammeThemeDto
  ): Promise<ProgrammeDto> => {
    const newProgramme: ProgrammeDto = {
      id: newGuid(),
      classroomId: classroom?.id || '',
      name: theme?.name || 'No theme',
      preferredLanguage: language,
      startDate: startDate.toISOString(),
      endDate: '',
      dailyProgrammes: [],
    };

    const dailyProgrammesResult = createProgrammeDailyProgrammes(newProgramme, startDate, theme);

    newProgramme.endDate = new Date(dailyProgrammesResult.endDate).toISOString();
    newProgramme.dailyProgrammes = dailyProgrammesResult.dailyProgrammes;

    clearOverlappingDaysProgrammes(newProgramme);

    dispatch(programmeActions.createProgramme(newProgramme));

    return newProgramme;
  };

  const validateStartDate = (startDate: Date): Date => {
    const isStartDateUnattendable = isWeekend(startDate) || holiday.isHoliday(startDate);

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

  const getConflictingProgramme = (startDate: Date, endDate: Date) => {
    return findConflictingProgramme(programmes, startDate, endDate);
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
    while (dailyProgrammes.length < 20) {
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

    let skippedFridays = 0;
    const themeAppliedDailyProgrammes = [];
    for (const dailyProg of dailyProgrammes) {
      if (isFriday(new Date(dailyProg.dayDate))) {
        skippedFridays += 1;
        themeAppliedDailyProgrammes.push(dailyProg);
        continue;
      }
      const day = +dailyProg.day - skippedFridays;
      const thDay = theme.themeDays.find((x) => +x.day === day);

      if (thDay) {
        dailyProg.largeGroupActivityId = thDay.largeGroupActivity[0].id;
        dailyProg.smallGroupActivityId = thDay.smallGroupActivity[0].id;
        dailyProg.storyActivityId = thDay.storyActivity[0].id;
        dailyProg.storyBookId = thDay.storyBook[0].id;
      }

      themeAppliedDailyProgrammes.push(dailyProg);
    }

    return {
      dailyProgrammes: themeAppliedDailyProgrammes,
      endDate,
    };
  };

  const createDailyProgrammesForNoTheme = (programme: ProgrammeDto, startDate: Date) => {
    let dayDate = startDate;
    let endDateResult = getNoThemedProgrammeEndDate(startDate);
    const dailyProgrammes: DailyProgrammeDto[] = [];

    for (let i = 0; i < endDateResult.totalDays; i++) {
      if (i > 0) {
        dayDate = getNextValidDate(dayDate);
      }

      dailyProgrammes.push({
        id: newGuid(),
        day: (i + 1).toString(),
        dayDate: dayDate.toISOString(),
        programmeId: programme.id ?? '',
        messageBoardText: '',
      });
    }

    return {
      dailyProgrammes,
      endDate: endDateResult.endDate,
    };
  };

  const clearOverlappingDaysProgrammes = (newPrograme: ProgrammeDto) => {
    const newProgrammeStartDate = new Date(newPrograme.startDate);
    const newProgrammeEndDate = new Date(newPrograme.endDate);

    const conflictingProgramme = findConflictingProgramme(
      programmes,
      newProgrammeStartDate,
      newProgrammeEndDate
    );

    if (conflictingProgramme) {
      let conflictingProgrammeCopy = { ...conflictingProgramme };
      const overlappingDays = getProgrammeDaysForInterval(
        { start: newProgrammeStartDate, end: newProgrammeEndDate },
        conflictingProgrammeCopy
      );
      const nonConflictingDays = conflictingProgrammeCopy.dailyProgrammes.filter(
        (dailyProg) =>
          !overlappingDays.some((overlappingDay) => overlappingDay.day === dailyProg.day)
      );
      const sortedDays = nonConflictingDays.sort((a, b) =>
        sortDateFunction(new Date(a.dayDate), new Date(b.dayDate))
      );

      conflictingProgrammeCopy.dailyProgrammes = nonConflictingDays;

      if (sortedDays.length > 0) {
        conflictingProgrammeCopy.startDate = sortedDays[0].dayDate;
        conflictingProgrammeCopy.endDate = sortedDays[sortedDays.length - 1].dayDate;
      }

      conflictingProgrammeCopy = refreshProgrammeDateRange(conflictingProgrammeCopy);
      dispatch(
        programmeActions.updateProgramme({
          programme: conflictingProgrammeCopy,
        })
      );
    }
  };

  return {
    createProgramme,
    getConflictingProgramme,
    validateStartDate,
    getThemedProgrammeEndDate,
    getNoThemedProgrammeEndDate,
  };
};
