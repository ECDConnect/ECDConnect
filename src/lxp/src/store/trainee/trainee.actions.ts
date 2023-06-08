import { TraineeDto } from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { TraineeService } from '@/services/TraineeService';
import { PractitionerTimeline } from '@ecdlink/graphql';

export const getTraineeById = createAsyncThunk<
  TraineeDto,
  { userId: string },
  ThunkApiType<RootState>
>(
  'getTraineeById',
  // eslint-disable-next-line no-empty-pattern
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let practitioner: TraineeDto | undefined;

      if (userId === null || userId.trim() === '') {
        return rejectWithValue('no practitioner id supplied');
      }

      if (userAuth?.auth_token) {
        practitioner = await new TraineeService(
          userAuth?.auth_token
        ).getTraineeByUserId(userId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!practitioner) {
        return rejectWithValue('Error getting practitioner');
      }

      return practitioner;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getTraineeTimeline = createAsyncThunk<
  PractitionerTimeline,
  { userId: string },
  ThunkApiType<RootState>
>('getTraineeTimeline', async ({ userId }, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
  } = getState();

  try {
    if (userAuth?.auth_token) {
      return await new TraineeService(userAuth?.auth_token).getTraineeTimeline(
        userId
      );
    } else {
      return rejectWithValue('no access token, profile check required');
    }
  } catch (err) {
    return rejectWithValue(err);
  }
});
