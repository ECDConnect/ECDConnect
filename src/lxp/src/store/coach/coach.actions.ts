import { CoachService } from '@/services/CoachService';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { CoachDto } from '@ecdlink/core';

export const getCoachById = createAsyncThunk<
  CoachDto,
  { id: number },
  ThunkApiType<RootState>
>(
  'getCoachById',
  // eslint-disable-next-line no-empty-pattern
  async ({ id }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      coach: { coach: coachCache },
    } = getState();

    if (!coachCache) {
      try {
        let coach: CoachDto | undefined;

        if (userAuth?.auth_token) {
          coach = await new CoachService(userAuth?.auth_token).getCoachById(id);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!coach) {
          return rejectWithValue('Error getting coach');
        }

        return coach;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return coachCache;
    }
  }
);
