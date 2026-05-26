import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import {
  PointsToDoItemModel,
  PointsUserDateSummary,
  PointsUserSummary,
  PointsUserYearMonthSummary,
} from '@ecdlink/graphql';
import { PointsService } from '@/services/PointsService';
import { differenceInDays } from 'date-fns';
import { OverrideCache } from '@/models/sync/override-cache';

export const PointActions = {
  GET_POINT_SUMMARY_FOR_USER: 'getPointsSummaryForUser',
  GET_USER_POINTS_SUMMARY_FOR_COACH: 'getUserPointsSummaryForCoach',
  YEAR_POINTS_VIEW: 'yearPointsView',
  POINTS_TO_DO_ITEMS: 'pointsTodoItems',
  SHARED_DATA: 'sharedData',
};

export const getPointsSummaryForUser = createAsyncThunk<
  PointsUserSummary[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  { userId: string; startDate: Date; endDate: Date } & OverrideCache,
  ThunkApiType<RootState>
>(
  PointActions.GET_POINT_SUMMARY_FOR_USER,
  // eslint-disable-next-line no-empty-pattern
  async (
    { userId, startDate, endDate, overrideCache = false },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
      points: { pointsSummary: pointsSummaryCache },
    } = getState();

    // === CACHE CHECK ===
    if (!overrideCache && pointsSummaryCache?.length) {
      return pointsSummaryCache;
    }

    // === FETCH FROM API ===
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      const pointsSummary = await new PointsService(
        userAuth.auth_token
      ).getPointsSummaryForUser(userId, startDate, endDate);

      return pointsSummary;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getUserPointsSummaryForCoach = createAsyncThunk<
  PointsUserSummary[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  { userId: string; startDate: Date; endDate: Date } & OverrideCache,
  ThunkApiType<RootState>
>(
  PointActions.GET_USER_POINTS_SUMMARY_FOR_COACH,
  // eslint-disable-next-line no-empty-pattern
  async (
    { userId, startDate, endDate, overrideCache = false },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
      practitionerForCoach: { pointsForPractitionerUser },
    } = getState();

    try {
      let pointsSummary: PointsUserSummary[] | undefined;

      // Basic caching
      if (!!pointsForPractitionerUser[userId]) {
        const daysSinceLoad = differenceInDays(
          new Date(),
          new Date(pointsForPractitionerUser[userId].dateLoaded)
        );

        if (daysSinceLoad < 1) {
          return pointsForPractitionerUser[userId].pointsSummaries;
        }
      }

      if (userAuth?.auth_token) {
        pointsSummary = await new PointsService(
          userAuth?.auth_token
        ).getPointsSummaryForUser(userId, startDate, endDate);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      return pointsSummary;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const yearPointsView = createAsyncThunk<
  PointsUserYearMonthSummary,
  // eslint-disable-next-line @typescript-eslint/ban-types
  { userId: string } & OverrideCache,
  ThunkApiType<RootState>
>(
  PointActions.YEAR_POINTS_VIEW,
  // eslint-disable-next-line no-empty-pattern
  async ({ userId, overrideCache = false }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      points: { yearPoints: yearPointsCache },
    } = getState();

    // === CACHE CHECK ===
    if (!overrideCache && !!yearPointsCache) {
      return yearPointsCache;
    }

    // === FETCH FROM API ===
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      const yearPoints: PointsUserYearMonthSummary = await new PointsService(
        userAuth?.auth_token
      ).yearPointsView(userId);

      return yearPoints;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const pointsTodoItems = createAsyncThunk<
  PointsToDoItemModel,
  // eslint-disable-next-line @typescript-eslint/ban-types
  { userId: string } & OverrideCache,
  ThunkApiType<RootState>
>(
  PointActions.POINTS_TO_DO_ITEMS,
  // eslint-disable-next-line no-empty-pattern
  async ({ userId, overrideCache = false }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      points: { pointsToDo: pointsToDoCache },
    } = getState();

    // === CACHE CHECK ===
    if (!overrideCache && !!pointsToDoCache) {
      return pointsToDoCache;
    }

    // === FETCH FROM API ===
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      const todoPoints: PointsToDoItemModel = await new PointsService(
        userAuth?.auth_token
      ).pointsTodoItems(userId);

      return todoPoints;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const sharedData = createAsyncThunk<
  PointsUserDateSummary | undefined,
  // eslint-disable-next-line @typescript-eslint/ban-types
  { userId: string; isMonthly: boolean } & OverrideCache,
  ThunkApiType<RootState>
>(
  PointActions.SHARED_DATA,
  // eslint-disable-next-line no-empty-pattern
  async (
    { userId, isMonthly, overrideCache = false },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
      points: { shareData: shareDataCache },
    } = getState();

    // === CACHE CHECK ===
    if (!overrideCache && !!shareDataCache) {
      return shareDataCache;
    }

    // === FETCH FROM API ===
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      const pointShareData: PointsUserDateSummary = await new PointsService(
        userAuth?.auth_token
      ).sharedData(userId, isMonthly);

      return pointShareData;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
