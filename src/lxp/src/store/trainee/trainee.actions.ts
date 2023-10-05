import { TraineeDto } from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { TraineeService } from '@/services/TraineeService';
import {
  TraineeOnBoardTimeline,
  UpdateVisitPlannedVisitDateModelInput,
  VisitData,
} from '@ecdlink/graphql';

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
        return rejectWithValue('no trainee practitioner id supplied');
      }

      if (userAuth?.auth_token) {
        practitioner = await new TraineeService(
          userAuth?.auth_token
        ).getTraineeByUserId(userId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      // if (!practitioner) {
      //   return rejectWithValue('Error getting trainee practitioner');
      // }

      return practitioner;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getTraineeTimeline = createAsyncThunk<
  TraineeOnBoardTimeline,
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

export const getTraineeVisitData = createAsyncThunk<
  VisitData[],
  { visitId: string },
  ThunkApiType<RootState>
>('getTraineeVisitData', async ({ visitId }, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
  } = getState();

  try {
    let content: VisitData[] | undefined = undefined;

    if (userAuth?.auth_token) {
      content = await new TraineeService(
        userAuth?.auth_token ?? ''
      ).getVisitDataForVisitId(visitId);
    } else {
      return rejectWithValue('no access token, profile check required');
    }

    if (!content) {
      return rejectWithValue('Error getting visit answers for trainee');
    }
    return content;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const updateTraineeOnboardTimelineSSVisitEvent = createAsyncThunk<
  any,
  UpdateVisitPlannedVisitDateModelInput,
  ThunkApiType<RootState>
>(
  'updateTraineeOnboardTimelineSSVisitEvent',
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        if (!!input && !!Object.keys(input).length) {
          const response = await new TraineeService(
            userAuth?.auth_token
          ).updateTraineeOnboardTimelineSSVisitEvent(input);

          return response;
        }
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
