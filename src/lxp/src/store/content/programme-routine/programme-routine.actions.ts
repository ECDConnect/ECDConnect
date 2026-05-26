import { ProgrammeRoutineDto } from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ContentRoutineService } from '@services/ContentRoutineService';
import { RootState, ThunkApiType } from '../../types';

export const ProgrammeRoutineActions = {
  GET_PROGRAMME_ROUTINES: 'getProgrammeRoutines',
};

export const getProgrammeRoutines = createAsyncThunk<
  ProgrammeRoutineDto[],
  { locale: string; overrideCache?: boolean },
  ThunkApiType<RootState>
>(
  ProgrammeRoutineActions.GET_PROGRAMME_ROUTINES,
  // eslint-disable-next-line no-empty-pattern
  async ({ locale, overrideCache = false }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      programmeRoutineData: { programmeRoutines: programmeRoutineCache },
    } = getState();

    // === CACHE CHECK ===
    if (
      !overrideCache &&
      programmeRoutineCache &&
      programmeRoutineCache.length > 0
    ) {
      return programmeRoutineCache;
    }

    // === FETCH FROM API ===
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      return await new ContentRoutineService(
        userAuth?.auth_token
      ).getProgrammeRoutines(locale);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
