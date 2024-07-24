import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getPractitionerProgressReportSummary,
  getProgressTrackingAgeGroups,
  getProgressTrackingCategories,
  getProgressTrackingLevels,
  getProgressTrackingSkills,
  getProgressTrackingSubCategories,
} from './progress-tracking.actions';
import { ProgressTrackingState } from './progress-tracking.types';

const initialState: ProgressTrackingState = {
  progressTrackingAgeGroups: { data: [], dateRefreshed: undefined },
  progressTrackingCategories: { data: [], dateRefreshed: undefined },
  progressTrackingSubCategories: { data: [], dateRefreshed: undefined },
  progressTrackingSkills: { data: [], dateRefreshed: undefined },
  progressTrackingLevels: undefined,
  practitionerProgressReportSummary: undefined,
};

const progressTrackingSlice = createSlice({
  name: 'progressTracking',
  initialState,
  reducers: {
    resetProgressTrackingState: (state) => {
      state.progressTrackingAgeGroups = initialState.progressTrackingAgeGroups;
      state.progressTrackingCategories =
        initialState.progressTrackingCategories;
      state.progressTrackingSubCategories =
        initialState.progressTrackingSubCategories;
      state.progressTrackingSkills = initialState.progressTrackingSkills;
      state.progressTrackingLevels = initialState.progressTrackingLevels;
      state.practitionerProgressReportSummary =
        initialState?.practitionerProgressReportSummary;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProgressTrackingAgeGroups.fulfilled, (state, action) => {
      state.progressTrackingAgeGroups = {
        data: [
          ...action.payload.map((x) => ({
            id: x.id,
            name: x.name,
            startAgeInMonths: Number(x.startAgeInMonths),
            endAgeInMonths: Number(x.endAgeInMonths),
            color: x.color,
            description: x.description,
          })),
        ],
        dateRefreshed: new Date().toDateString(),
      };
    });
    builder.addCase(
      getProgressTrackingCategories.fulfilled,
      (state, action) => {
        state.progressTrackingCategories = {
          data: action.payload,
          dateRefreshed: new Date().toDateString(),
        };
      }
    );
    builder.addCase(
      getProgressTrackingSubCategories.fulfilled,
      (state, action) => {
        state.progressTrackingSubCategories = {
          data: action.payload,
          dateRefreshed: new Date().toDateString(),
        };
      }
    );
    builder.addCase(getProgressTrackingSkills.fulfilled, (state, action) => {
      state.progressTrackingSkills = {
        data: action.payload,
        dateRefreshed: new Date().toDateString(),
      };
    });
    builder.addCase(getProgressTrackingLevels.fulfilled, (state, action) => {
      state.progressTrackingLevels = action.payload;
    });
    builder.addCase(
      getPractitionerProgressReportSummary.fulfilled,
      (state, action) => {
        state.practitionerProgressReportSummary = action.payload;
      }
    );
  },
});

const { reducer: progressTrackingReducer, actions: progressTrackingActions } =
  progressTrackingSlice;

const progressTrackingPersistConfig = {
  key: 'progressTracking',
  storage: localForage,
  blacklist: [],
};

export {
  progressTrackingPersistConfig,
  progressTrackingReducer,
  progressTrackingActions,
};
