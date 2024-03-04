import { HealthCareWorkerService } from '@/services/HealthCareWorkerService';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { HealthCareWorkerInputModelInput } from '@ecdlink/graphql';
import { HealthCareWorkerDto } from '@ecdlink/core';

export const HealthCareWorkerActions = {
  UPDATE_HEALTH_CAREWORKER_TABS: 'updateHealthCareWorkerTabs',
  UPDATE_HEALTH_CARE_WORKER_WELCOME_MESSAGE:
    'updateHealthCareWorkerWelcomeMessage',
  UPDATE_HEALTH_CARE_WORKER_BY_ID: 'updateHealthCareWorkerById',
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
  HealthCareWorkerActions.UPDATE_HEALTH_CARE_WORKER_BY_ID,
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

export const updateHealthCareWorkerWelcomeMessage = createAsyncThunk<
  HealthCareWorkerDto,
  {
    healthCareWorkerId: string;
    welcomeMessage: string;
    shareContactInfo: boolean;
  },
  ThunkApiType<RootState>
>(
  HealthCareWorkerActions.UPDATE_HEALTH_CARE_WORKER_WELCOME_MESSAGE,
  async (
    { healthCareWorkerId, welcomeMessage, shareContactInfo },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (userAuth?.auth_token) {
        const response = await new HealthCareWorkerService(
          userAuth?.auth_token
        ).updateHealthCareWorkerWelcomeMessage(
          healthCareWorkerId,
          welcomeMessage,
          shareContactInfo
        );

        return response;
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
