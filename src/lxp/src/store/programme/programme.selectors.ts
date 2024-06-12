import { DailyProgrammeDto, ProgrammeDto } from '@ecdlink/core';
import { createSelector } from '@reduxjs/toolkit';
import { isAfter, isBefore, isSameDay } from 'date-fns';
import { RootState } from '../types';

export const getProgrammes = (state: RootState): ProgrammeDto[] =>
  state.programmeData.programmes || [];

export const getProgrammeById = (programmeId?: string) =>
  createSelector(
    (state: RootState) => state.programmeData.programmes || [],
    (programmes: ProgrammeDto[]) =>
      programmes.find((programme) => programme.id === programmeId)
  );

export const getTodaysProgramme = () =>
  createSelector(
    (state: RootState) => state.programmeData.programmes || [],
    (programmes: ProgrammeDto[]) =>
      programmes.find((programme) => {
        return programme.dailyProgrammes.some((dailyProg) => {
          return isSameDay(new Date(dailyProg.dayDate), new Date());
        });
      })
  );

export const getProgrammeByDate = (date: Date) =>
  createSelector(
    (state: RootState) => state.programmeData.programmes || [],
    (programmes: ProgrammeDto[]) =>
      programmes.find(
        (programme) =>
          programme.dailyProgrammes.find((dailyRoutine: DailyProgrammeDto) =>
            isSameDay(new Date(dailyRoutine.dayDate), date)
          ) ||
          isSameDay(new Date(programme.startDate || 0), date) ||
          isSameDay(new Date(programme.endDate || 0), date) ||
          (isAfter(new Date(programme.startDate || 0), date) &&
            isBefore(new Date(programme.endDate || 0), date))
      )
  );

export const getProgrammeByDateAndClassroomGroupId = ({
  date,
  classroomGroupId,
}: {
  date: Date;
  classroomGroupId: string;
}) =>
  createSelector(getProgrammeByDate(date), (programme) =>
    programme?.classroomGroupId === classroomGroupId ? programme : undefined
  );

export const getProgrammesAfterDate = (date: Date) =>
  createSelector(
    (state: RootState) => state.programmeData.programmes || [],
    (programmes: ProgrammeDto[]) =>
      programmes.filter((programme) =>
        isAfter(new Date(programme.startDate), date)
      )
  );

export const getProgrammesBeforeDate = (date: Date) =>
  createSelector(
    (state: RootState) => state.programmeData.programmes || [],
    (programmes: ProgrammeDto[]) =>
      programmes.filter((programme) =>
        isBefore(new Date(programme.endDate), date)
      )
  );
