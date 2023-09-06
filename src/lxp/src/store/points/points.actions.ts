import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { PointsUserSummary } from '@ecdlink/graphql';
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
