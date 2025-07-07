import { DailyProgrammeDto, ProgrammeDto } from '@ecdlink/core';
import { createSelector } from '@reduxjs/toolkit';
import { compareDesc, isAfter, isBefore, isSameDay, parseISO } from 'date-fns';
import { RootState } from '../types';

export const getProgrammes = (state: RootState): ProgrammeDto[] =>
  [...(state.programmeData.programmes || [])]
    ?.map((programme) => ({
      ...programme,
      dailyProgrammes: programme?.dailyProgrammes
        ?.filter(
          (day) => day?.isActive === undefined || day?.isActive !== false
        )
        .sort((a, b) => {
          const dateA = a?.dayDate
            ? parseISO(a.dayDate as string)
            : new Date(0);
          const dateB = b?.dayDate
            ? parseISO(b.dayDate as string)
            : new Date(0);
          return compareDesc(dateB, dateA);
        }),
    }))
    ?.sort((a, b) => {
      const dateA = a?.insertedDate
        ? parseISO(a.insertedDate as string)
        : new Date(0);
      const dateB = b?.insertedDate
        ? parseISO(b.insertedDate as string)
        : new Date(0);
      return compareDesc(dateA, dateB);
    }) || [];

export const getProgrammeById = (programmeId?: string) =>
  createSelector(getProgrammes, (programmes: ProgrammeDto[]) =>
    programmes.find((programme) => programme.id === programmeId)
  );

export const getTodaysProgramme = () =>
  createSelector(getProgrammes, (programmes: ProgrammeDto[]) =>
    programmes.find((programme) => {
      return programme.dailyProgrammes.some((dailyProg) => {
        return isSameDay(new Date(dailyProg.dayDate), new Date());
      });
    })
  );

export const getProgrammeByDateAndClassroomGroupId = ({
  date,
  classroomGroupId,
}: {
  date: Date;
  classroomGroupId: string;
}) =>
  createSelector(getProgrammes, (programmes: ProgrammeDto[]) =>
    programmes
      ?.filter((programme) => programme?.classroomGroupId === classroomGroupId)
      ?.find(
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

export const getProgrammesAfterDate = (date: Date) =>
  createSelector(getProgrammes, (programmes: ProgrammeDto[]) =>
    programmes.filter((programme) =>
      isAfter(new Date(programme.startDate), date)
    )
  );

export const getProgrammesBeforeDate = (date: Date) =>
  createSelector(getProgrammes, (programmes: ProgrammeDto[]) =>
    programmes.filter((programme) =>
      isBefore(new Date(programme.endDate), date)
    )
  );
