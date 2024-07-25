import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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

  childProgressReports: [],
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
    updateSkill: (
      state,
      action: PayloadAction<{
        childId: string;
        reportingPeriodId: string;
        skillId: number;
        value: string;
      }>
    ) => {
      const { childId, reportingPeriodId, skillId, value } = action.payload;

      const reportIndex = state.childProgressReports.findIndex(
        (x) => x.childId === childId && x.reportingPeriodId
      );

      if (reportIndex < 0) {
        // No current report so, create and add our first skill
        state.childProgressReports = [
          ...state.childProgressReports,
          {
            childId: childId,
            reportingPeriodId: reportingPeriodId,
            synced: false,
            skillObservations: [
              {
                skillId: skillId,
                value: value,
              },
            ],
          },
        ];
      } else {
        // Update existing report
        state.childProgressReports = [
          ...state.childProgressReports.slice(0, reportIndex),
          ...state.childProgressReports.slice(reportIndex + 1),
          {
            ...state.childProgressReports[reportIndex],
            skillObservations: [
              ...state.childProgressReports[
                reportIndex
              ].skillObservations.filter((x) => x.skillId === skillId),
              { skillId, value },
            ],
          },
        ];
      }
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
