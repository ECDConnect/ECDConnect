import { ActivityDto } from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ContentActivityService } from '@services/ContentActivityService';
import { RootState, ThunkApiType } from '../../types';

export const ActivitiesActions = {
  GET_ACTIVITIES: 'getActivities',
};

export const getActivities = createAsyncThunk<
  ActivityDto[],
  { locale: string },
  ThunkApiType<RootState>
>(
  ActivitiesActions.GET_ACTIVITIES,
  async ({ locale }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      activityData: { activities: activitiesCache },
    } = getState();

    if (!activitiesCache) {
      try {
        let activities: ActivityDto[] | undefined;

        if (userAuth?.auth_token) {
          activities = await new ContentActivityService(
            userAuth?.auth_token
          ).getActivities(locale);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!activities) {
          return rejectWithValue('Error getting activities');
        }

        return activities;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return activitiesCache;
    }
  }
);
