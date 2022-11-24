import { HealthCareWorkerService } from '@/services/healthCareWorkerService';
import { HealthCareWorkerDto } from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';

export const getHealthCareWorkerByUserId = createAsyncThunk<
  HealthCareWorkerDto,
  { userId: string },
  ThunkApiType<RootState>
>(
  'getHealthCareWorkerByUserId',
  // eslint-disable-next-line no-empty-pattern
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let healthCareWorker: HealthCareWorkerDto | undefined;

      if (userAuth?.auth_token) {
        healthCareWorker = await new HealthCareWorkerService(
          userAuth?.auth_token
        ).getHealthCareWorkerByUserId(userId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!healthCareWorker) {
        return rejectWithValue('Error getting healthCareWorker');
      }

      return healthCareWorker;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export type UpdateHealthCareWorkerRequest = {
  id: string;
  input: any;
};

export const updateHealthCareWorkerById = createAsyncThunk<
  any,
  UpdateHealthCareWorkerRequest,
  ThunkApiType<RootState>
>(
  'updateHealthCareWorkerById',
  // eslint-disable-next-line no-empty-pattern
  async ({ input, id }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      // let mappedCaregiverInput = mapPractitioner(input);

      if (userAuth?.auth_token) {
        await new HealthCareWorkerService(
          userAuth?.auth_token
        ).UpdateHealthCareWorker(id, input);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// const mapPractitioner = (x: Partial<any>): any => ({
//   User: {
//     firstName: x.firstName,
//     surname: x.surname,
//   },
// });
