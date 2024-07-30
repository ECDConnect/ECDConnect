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

      const report = state.childProgressReports.find(
        (x) => x.childId === childId && x.reportingPeriodId
      );

      if (!report) {
        // No current report so, create and add our first skill
        state.childProgressReports = [
          ...state.childProgressReports,
          {
            childId: childId,
            reportingPeriodId: reportingPeriodId,
            isComplete: false,
            synced: false,
            skillsToWorkOn: [],
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
          ...state.childProgressReports.filter(
            (x) =>
              x.childId !== childId && x.reportingPeriodId !== reportingPeriodId
          ),
          {
            ...report,
            skillObservations: [
              ...report.skillObservations.filter((x) => x.skillId !== skillId),
              { skillId, value },
            ],
          },
        ];
      }
    },
    addSkillToWorkOn: (
      state,
      action: PayloadAction<{
        childId: string;
        reportingPeriodId: string;
        skillId: number;
      }>
    ) => {
      const { childId, reportingPeriodId, skillId } = action.payload;

      const report = state.childProgressReports.find(
        (x) => x.childId === childId && x.reportingPeriodId
      );

      if (!report || report.skillsToWorkOn.some((x) => x.skillId === skillId)) {
        return;
      }

      state.childProgressReports = [
        ...state.childProgressReports.filter(
          (x) =>
            x.childId !== childId && x.reportingPeriodId !== reportingPeriodId
        ),
        {
          ...report,
          skillsToWorkOn: [
            ...report.skillsToWorkOn,
            { skillId, howToSupport: '' },
          ],
        },
      ];
    },
    removeSkillToWorkOn: (
      state,
      action: PayloadAction<{
        childId: string;
        reportingPeriodId: string;
        skillId: number;
      }>
    ) => {
      const { childId, reportingPeriodId, skillId } = action.payload;

      const report = state.childProgressReports.find(
        (x) => x.childId === childId && x.reportingPeriodId
      );

      if (!report) {
        return;
      }

      state.childProgressReports = [
        ...state.childProgressReports.filter(
          (x) =>
            x.childId !== childId && x.reportingPeriodId !== reportingPeriodId
        ),
        {
          ...report,
          skillsToWorkOn: [
            ...report.skillsToWorkOn.filter((x) => x.skillId !== skillId),
          ],
        },
      ];
    },
    updateSkillToWorkOn: (
      state,
      action: PayloadAction<{
        childId: string;
        reportingPeriodId: string;
        skillId: number;
        value: string;
      }>
    ) => {
      const { childId, reportingPeriodId, skillId, value } = action.payload;

      const report = state.childProgressReports.find(
        (x) => x.childId === childId && x.reportingPeriodId
      );

      if (!report) {
        return;
      }

      state.childProgressReports = [
        ...state.childProgressReports.filter(
          (x) =>
            x.childId !== childId && x.reportingPeriodId !== reportingPeriodId
        ),
        {
          ...report,
          skillsToWorkOn: [
            ...report.skillsToWorkOn.filter((x) => x.skillId !== skillId),
            { skillId: skillId, howToSupport: value },
          ],
        },
      ];
    },
    updateHowToSupport: (
      state,
      action: PayloadAction<{
        childId: string;
        reportingPeriodId: string;
        value: string;
      }>
    ) => {
      const { childId, reportingPeriodId, value } = action.payload;

      const report = state.childProgressReports.find(
        (x) => x.childId === childId && x.reportingPeriodId
      );

      if (!report) {
        return;
      }

      state.childProgressReports = [
        ...state.childProgressReports.filter(
          (x) =>
            x.childId !== childId && x.reportingPeriodId !== reportingPeriodId
        ),
        {
          ...report,
          howToSupport: value,
        },
      ];
    },
    updateNotes: (
      state,
      action: PayloadAction<{
        childId: string;
        reportingPeriodId: string;
        value: string;
      }>
    ) => {
      const { childId, reportingPeriodId, value } = action.payload;

      const report = state.childProgressReports.find(
        (x) => x.childId === childId && x.reportingPeriodId
      );

      if (!report) {
        return;
      }

      state.childProgressReports = [
        ...state.childProgressReports.filter(
          (x) =>
            x.childId !== childId && x.reportingPeriodId !== reportingPeriodId
        ),
        {
          ...report,
          notes: value,
        },
      ];
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
