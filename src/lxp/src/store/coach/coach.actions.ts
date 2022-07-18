import { CoachService } from '@/services/CoachService';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { CoachDto } from '@ecdlink/core';

export const getCoachByUserId = createAsyncThunk<
  CoachDto,
  {},
  ThunkApiType<RootState>
>(
  'getCoachByUserId',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      coach: { coach: coachCache },
    } = getState();

    console.log(coachCache);

    if (!coachCache) {
      try {
        let coach: CoachDto | undefined;

        if (userAuth?.auth_token) {
          coach = await new CoachService(userAuth?.auth_token).getCoachByUserId(
            userAuth.id
          );
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
