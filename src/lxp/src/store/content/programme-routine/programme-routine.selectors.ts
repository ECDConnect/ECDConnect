import { ProgrammeRoutineDto } from '@ecdlink/core';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../types';

export const getProgrammeRoutines = (state: RootState): ProgrammeRoutineDto[] =>
  state.programmeRoutineData.programmeRoutines || [];

export const getProgrammeRoutineById = (programmeRoutineId: number) =>
  createSelector(
    (state: RootState) => state.programmeRoutineData.programmeRoutines || [],
    (programmeRoutines: ProgrammeRoutineDto[]) =>
      programmeRoutines.find((routine) => routine.id === programmeRoutineId)
  );
