import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { PointsLibrary, PointsUserSummary } from '@ecdlink/graphql';
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

export const getPointsLibrary = createAsyncThunk<
  PointsLibrary[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getPointsLibrary',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let pointsLibrary: PointsLibrary[] | undefined;

      if (userAuth?.auth_token) {
        pointsLibrary = await new PointsService(
          userAuth?.auth_token
        ).getPointsLibrary();
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      return pointsLibrary;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
