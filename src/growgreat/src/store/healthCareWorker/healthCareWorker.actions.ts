import { HealthCareWorkerService } from '@/services/HealthCareWorkerService';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { HealthCareWorkerInputModelInput } from '@ecdlink/graphql';
import { HealthCareWorkerDto } from '@ecdlink/core';
import { ClinicService } from '@/services/Clinic';

export const HealthCareWorkerActions = {
  UPDATE_HEALTH_CAREWORKER_TABS: 'updateHealthCareWorkerTabs',
};

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
  userId: string;
  input: any;
};

export const updateHealthCareWorkerById = createAsyncThunk<
  any,
  UpdateHealthCareWorkerRequest,
  ThunkApiType<RootState>
>(
  'updateHealthCareWorkerById',
  // eslint-disable-next-line no-empty-pattern
  async ({ input, userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        await new HealthCareWorkerService(
          userAuth?.auth_token
        ).updateHealthCareWorker(userId, input);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateHealthCareWorkerTabs = createAsyncThunk<
  HealthCareWorkerDto,
  { input: HealthCareWorkerInputModelInput; userId: string },
  ThunkApiType<RootState>
>(
  HealthCareWorkerActions.UPDATE_HEALTH_CAREWORKER_TABS,
  async ({ input, userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (userAuth?.auth_token) {
        const response = await new HealthCareWorkerService(
          userAuth?.auth_token
        ).updateHealthCareWorkerTabs(input, userId);

        return response;
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
