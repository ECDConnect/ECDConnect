import { ActivityDto } from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ContentActivityService } from '@services/ContentActivityService';
import { RootState, ThunkApiType } from '../../types';

export const ActivitiesActions = {
  GET_ACTIVITIES: 'getActivities',
};

export const getActivities = createAsyncThunk<
  ActivityDto[],
  { locale: string; overrideCache?: boolean },
  ThunkApiType<RootState>
>(
  ActivitiesActions.GET_ACTIVITIES,
  async ({ locale, overrideCache = false }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      activityData: { activities: activitiesCache },
    } = getState();

    // Force fresh fetch if overrideCache is explicitly true
    const shouldFetchFresh = overrideCache === true;

    if (shouldFetchFresh || !activitiesCache || activitiesCache.length === 0) {
      try {
        if (!userAuth?.auth_token) {
          return rejectWithValue('no access token, profile check required');
        }

        const activities = await new ContentActivityService(
          userAuth.auth_token
        ).getActivities(locale);

        if (!activities) {
          return rejectWithValue('Error getting activities');
        }

        return activities;
      } catch (err: any) {
        return rejectWithValue(err?.message ?? err ?? 'Unknown error');
      }
    }

    // Return cached value (fulfilled with cache)
    return activitiesCache;
  }
);
