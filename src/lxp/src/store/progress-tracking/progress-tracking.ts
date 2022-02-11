import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getProgressTrackingCategories,
  getProgressTrackingLevels,
  getProgressTrackingSkills,
  getProgressTrackingSubCategories,
} from './progress-tracking.actions';
import { ProgressTrackingState } from './progress-tracking.types';

const initialState: ProgressTrackingState = {
  progressTrackingCategories: undefined,
  progressTrackingSubCategories: undefined,
  progressTrackingSkills: undefined,
  progressTrackingLevels: undefined,
};

const progressTrackingSlice = createSlice({
  name: 'progressTracking',
  initialState,
  reducers: {
    resetProgressTrackingState: (state) => {
      state.progressTrackingCategories = initialState.progressTrackingCategories;
      state.progressTrackingSubCategories = initialState.progressTrackingSubCategories;
      state.progressTrackingSkills = initialState.progressTrackingSkills;
      state.progressTrackingLevels = initialState.progressTrackingLevels;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProgressTrackingCategories.fulfilled, (state, action) => {
      state.progressTrackingCategories = action.payload;
    });
    builder.addCase(getProgressTrackingSubCategories.fulfilled, (state, action) => {
      state.progressTrackingSubCategories = action.payload;
    });
    builder.addCase(getProgressTrackingSkills.fulfilled, (state, action) => {
      state.progressTrackingSkills = action.payload;
    });
    builder.addCase(getProgressTrackingLevels.fulfilled, (state, action) => {
      state.progressTrackingLevels = action.payload;
    });
  },
});

const { reducer: progressTrackingReducer, actions: progressTrackingActions } =
  progressTrackingSlice;

const progressTrackingPersistConfig = {
  key: 'progressTracking',
  storage: localForage,
  blacklist: [],
};

export { progressTrackingPersistConfig, progressTrackingReducer, progressTrackingActions };
