import { ActivityDto } from '@ecdlink/core/';
import { createSelector } from '@reduxjs/toolkit';
import { filterActivitiesByType } from '@utils/classroom/programme-planning/activity-search.utils';
import { RootState } from '../../types';

export const getActivities = (state: RootState): ActivityDto[] =>
  state.activityData.activities || [];

export const getActivityById = (activityId?: number) =>
  createSelector(
    (state: RootState) => state.activityData.activities || [],
    (activities: ActivityDto[]) =>
      activities.find((activity) => activity.id === activityId)
  );

export const getActivitiesByType = (type?: string) =>
  createSelector(
    (state: RootState) => state.activityData.activities || [],
    (activities: ActivityDto[]) => {
      if (!type) return [];
      return filterActivitiesByType(type, activities);
    }
  );

export const getStoryActivitiesByType = (type?: string) =>
  createSelector(
    (state: RootState) => state.activityData.activities || [],
    (activities: ActivityDto[]) => {
      if (!type) return [];
      return activities.filter(
        (act) =>
          act.subType &&
          act.subType?.toLowerCase()?.includes(type.toLowerCase())
      );
    }
  );
