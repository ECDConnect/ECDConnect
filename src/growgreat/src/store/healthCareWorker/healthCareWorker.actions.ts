import { HealthCareWorkerService } from '@/services/HealthCareWorkerService';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import {
  MoreInformation,
  TeamStandingModel,
  UpdateHealthCareWorkerInputModelInput,
  UpdateHealthCareWorkerTabsInputModelInput,
} from '@ecdlink/graphql';
import {
  HealthCareWorkerDto,
  PointsTodoItemDto,
  UserPointsAcitivtyDto,
} from '@ecdlink/core';
import { differenceInDays } from 'date-fns';
import InfoService from '@/services/InfoService/InfoService';

export const HealthCareWorkerActions = {
  UPDATE_HEALTH_CAREWORKER_TABS: 'updateHealthCareWorkerTabs',
  UPDATE_HEALTH_CARE_WORKER_WELCOME_MESSAGE:
    'updateHealthCareWorkerWelcomeMessage',
  UPDATE_HEALTH_CARE_WORKER_BY_ID: 'updateHealthCareWorkerById',
  GET_HEALTH_CARE_WORKER_POINTS: 'getHealthCareWorkerPoints',
  GET_HEALTH_CARE_WORKER_TEAM_STANDING: 'getHealthCareWorkerTeamStanding',
  GET_HEALTH_CARE_WORKER_POINTS_TODO_ITEMS:
    'getHealthCareWorkerPointsTodoItems',
  GET_MORE_INFORMATION: 'getMoreInformation',
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

export const getHealthCareWorkerPoints = createAsyncThunk<
  UserPointsAcitivtyDto[],
  { userId: string; startDate: Date; endDate?: Date },
  ThunkApiType<RootState>
>(
  HealthCareWorkerActions.GET_HEALTH_CARE_WORKER_POINTS,
  async ({ userId, startDate, endDate }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let points: UserPointsAcitivtyDto[];

      if (userAuth?.auth_token) {
        points = await new HealthCareWorkerService(
          userAuth?.auth_token
        ).getHealthCareWorkerPoints(userId, startDate, endDate);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      return points;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getHealthCareWorkerTeamStanding = createAsyncThunk<
  TeamStandingModel,
  { userId: string },
  ThunkApiType<RootState>
>(
  HealthCareWorkerActions.GET_HEALTH_CARE_WORKER_TEAM_STANDING,
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new HealthCareWorkerService(
          userAuth?.auth_token
        ).getHealthCareWorkerTeamStanding(userId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getHealthCareWorkerPointsTodoItems = createAsyncThunk<
  PointsTodoItemDto[],
  { healthCareWorkerId: string },
  ThunkApiType<RootState>
>(
  HealthCareWorkerActions.GET_HEALTH_CARE_WORKER_POINTS_TODO_ITEMS,
  async ({ healthCareWorkerId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new HealthCareWorkerService(
          userAuth?.auth_token
        ).getHealthCareWorkerPointsTodoItems(healthCareWorkerId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export type UpdateHealthCareWorkerRequest = {
  userId: string;
  input: UpdateHealthCareWorkerInputModelInput;
};

export const updateHealthCareWorker = createAsyncThunk<
  HealthCareWorkerDto,
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
        const response = await new HealthCareWorkerService(
          userAuth?.auth_token
        ).updateHealthCareWorker(userId, input);

        return response;
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
  { input: UpdateHealthCareWorkerTabsInputModelInput; userId: string },
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

export const getMoreInformation = createAsyncThunk<
  MoreInformation[],
  { section: string; locale: string },
  ThunkApiType<RootState>
>(
  HealthCareWorkerActions.GET_MORE_INFORMATION,
  async ({ locale, section }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      healthCareWorker: { points },
    } = getState();

    try {
      const currentInfo = points?.infoPage?.find((item) => item[locale])?.[
        locale
      ];

      if (currentInfo && currentInfo.data) {
        const daysSinceLateLoad = differenceInDays(
          new Date(),
          new Date(currentInfo?.dateLoaded)
        );

        if (daysSinceLateLoad < 1) {
          return currentInfo?.data;
        }
      }
      if (userAuth?.auth_token) {
        return await new InfoService().getMoreInformation(section, locale);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
