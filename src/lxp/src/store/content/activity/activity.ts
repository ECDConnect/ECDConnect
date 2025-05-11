import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { getActivities } from './activity.actions';
import { ActivityState } from './activity.types';
import {
  setFulfilledThunkActionStatus,
  setThunkActionStatus,
} from '@/store/utils';

const initialState: ActivityState = {
  activities: undefined,
};

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    resetActivityState: (state) => {
      state.activities = initialState.activities;
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, getActivities);
    builder.addCase(getActivities.fulfilled, (state, action) => {
      state.activities = action.payload;
      setFulfilledThunkActionStatus(state, action);
    });
  },
});

const { reducer: activityReducer, actions: activityActions } = activitySlice;

const activityPersistConfig = {
  key: 'activity',
  storage: localForage,
  blacklist: [],
};

export { activityPersistConfig, activityReducer, activityActions };
