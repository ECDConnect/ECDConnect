import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { PointsLibrary, PointsUserSummary } from '@ecdlink/graphql';
import { PointsService } from '@/services/PointsService';

export const getPointsSummaryForUser = createAsyncThunk<
  PointsUserSummary[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getPointsSummaryForUser',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let pointsSummary: PointsUserSummary[] | undefined;

      if (userAuth?.auth_token) {
        pointsSummary = await new PointsService(
          userAuth?.auth_token
        ).getPointsSummaryForUser(userAuth?.id);
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
