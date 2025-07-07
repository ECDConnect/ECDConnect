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

export const getPointsSummaryForUser = createAsyncThunk<
  PointsUserSummary[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  { userId: string; startDate: Date; endDate: Date },
  ThunkApiType<RootState>
>(
  'getPointsSummaryForUser',
  // eslint-disable-next-line no-empty-pattern
  async ({ userId, startDate, endDate }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let pointsSummary: PointsUserSummary[] | undefined;

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

export const getUserPointsSummaryForCoach = createAsyncThunk<
  PointsUserSummary[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  { userId: string; startDate: Date; endDate: Date },
  ThunkApiType<RootState>
>(
  'getPointsSummaryForUser',
  // eslint-disable-next-line no-empty-pattern
  async ({ userId, startDate, endDate }, { getState, rejectWithValue }) => {
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
  { userId: string },
  ThunkApiType<RootState>
>(
  'yearPointsView',
  // eslint-disable-next-line no-empty-pattern
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let yearPoints: PointsUserYearMonthSummary | undefined;

      if (userAuth?.auth_token) {
        yearPoints = await new PointsService(
          userAuth?.auth_token
        ).yearPointsView(userId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      return yearPoints;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const pointsTodoItems = createAsyncThunk<
  PointsToDoItemModel,
  // eslint-disable-next-line @typescript-eslint/ban-types
  { userId: string },
  ThunkApiType<RootState>
>(
  'pointsTodoItems',
  // eslint-disable-next-line no-empty-pattern
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let todoPoints: PointsToDoItemModel | undefined;

      if (userAuth?.auth_token) {
        todoPoints = await new PointsService(
          userAuth?.auth_token
        ).pointsTodoItems(userId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
      return todoPoints;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const sharedData = createAsyncThunk<
  PointsUserDateSummary | undefined,
  // eslint-disable-next-line @typescript-eslint/ban-types
  { userId: string; isMonthly: boolean },
  ThunkApiType<RootState>
>(
  'sharedData',
  // eslint-disable-next-line no-empty-pattern
  async ({ userId, isMonthly }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let pointShareData: PointsUserDateSummary | undefined;

      if (userAuth?.auth_token) {
        pointShareData = await new PointsService(
          userAuth?.auth_token
        ).sharedData(userId, isMonthly);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
      if (pointShareData) {
        return pointShareData;
      } else {
        return undefined;
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
