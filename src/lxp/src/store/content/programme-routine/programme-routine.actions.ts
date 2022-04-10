import { ProgrammeRoutineDto } from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ContentRoutineService } from '@services/ContentRoutineService';
import { RootState, ThunkApiType } from '../../types';

export const getProgrammeRoutines = createAsyncThunk<
  ProgrammeRoutineDto[],
  { locale: string },
  ThunkApiType<RootState>
>(
  'getProgrammeRoutines',
  // eslint-disable-next-line no-empty-pattern
  async ({ locale }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      programmeRoutineData: { programmeRoutines: programmeRoutineCache },
    } = getState();

    if (!programmeRoutineCache) {
      try {
        let programmeRoutines: ProgrammeRoutineDto[] | undefined;

        if (userAuth?.auth_token) {
          programmeRoutines = await new ContentRoutineService(
            userAuth?.auth_token
          ).getProgrammeRoutines(locale);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!programmeRoutines) {
          return rejectWithValue('Error getting programme routines');
        }

        return programmeRoutines;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return programmeRoutineCache;
    }
  }
);
