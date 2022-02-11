import { ChildProgressObservationReport, ChildProgressReportSummaryModel } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  generateChildProgressReport,
  getChildProgressReportSummary,
  getUserContentChildProgressReports,
  saveUserContentChildProgressReport,
  updateChildProgressReport,
} from './report.actions';
import { ContentReportState, UnSyncedReportItem } from './report.types';
const initialState: ContentReportState = {
  childProgressionReports: [],
  unsyncedChildProgressReportsIds: [],
};

const contentReportSlice = createSlice({
  name: 'contentReport',
  initialState,
  reducers: {
    resetContentReportState: (state) => {
      state.childProgressionReports = initialState.childProgressionReports || [];
      state.unsyncedChildProgressReportsIds = initialState.unsyncedChildProgressReportsIds || [];
    },
    setSkillsForCategory: (state, action) => {
      if (!state.childProgressionReports) return;

      const reportIndex = (state.childProgressionReports || []).findIndex(
        (report) => report.id === action.payload.reportId
      );

      if (reportIndex < 0) return;

      const categoryIndex = (state.childProgressionReports || [])[
        reportIndex
      ]?.categories.findIndex((cat: any) => cat.categoryId === action.payload.categoryId);
      if (categoryIndex < 0) return;

      state.childProgressionReports[reportIndex].categories[categoryIndex].tasks =
        action.payload.tasks;
      state.childProgressionReports[reportIndex].categories[categoryIndex].missingTasks =
        action.payload.missingTasks;
    },
    setCategoryStatus: (state, action) => {
      if (!state.childProgressionReports) return;

      const reportIndex = state.childProgressionReports.findIndex(
        (report) => report.id === action.payload.reportId
      );

      if (reportIndex < 0) return;

      const categoryIndex = state.childProgressionReports[reportIndex]?.categories.findIndex(
        (cat: any) => cat.categoryId === action.payload.categoryId
      );
      if (categoryIndex < 0) return;

      state.childProgressionReports[reportIndex].categories[categoryIndex].status =
        action.payload.status;
    },
    setCategoryAchievedLevelId: (state, action) => {
      if (!state.childProgressionReports) return;

      const reportIndex = state.childProgressionReports.findIndex(
        (report) => report.id === action.payload.reportId
      );

      if (reportIndex < 0) return;

      const categoryIndex = state.childProgressionReports[reportIndex]?.categories.findIndex(
        (cat: any) => cat.categoryId === action.payload.categoryId
      );
      if (categoryIndex < 0) return;

      state.childProgressionReports[reportIndex].categories[categoryIndex].achievedLevelId =
        action.payload.levelId;
    },
    setCategorySupportTask: (state, action) => {
      if (!state.childProgressionReports) return;

      const reportIndex = state.childProgressionReports.findIndex(
        (report) => report.id === action.payload.reportId
      );

      if (reportIndex < 0) return;

      const categoryIndex = state.childProgressionReports[reportIndex]?.categories.findIndex(
        (cat: any) => cat.categoryId === action.payload.categoryId
      );
      if (categoryIndex < 0) return;

      const currentCategory = state.childProgressionReports[reportIndex].categories[categoryIndex];

      if (!currentCategory) return;

      state.childProgressionReports[reportIndex].categories[categoryIndex].supportingTask =
        action.payload.supportingTask;
    },
    setReportObservationNote: (state, action) => {
      if (!state.childProgressionReports) return;

      const reportIndex = state.childProgressionReports.findIndex(
        (report) => report.id === action.payload.reportId
      );

      if (reportIndex < 0) return;

      state.childProgressionReports[reportIndex].observationNote = action.payload.note;
    },
    setChildEnjoys: (state, action) => {
      if (!state.childProgressionReports) return;

      const reportIndex = state.childProgressionReports.findIndex(
        (report) => report.id === action.payload.reportId
      );

      if (reportIndex < 0) return;

      state.childProgressionReports[reportIndex].childEnjoys = action.payload.childEnjoys;
    },
    setChildProgressedWith: (state, action) => {
      if (!state.childProgressionReports) return;

      const reportIndex = state.childProgressionReports.findIndex(
        (report) => report.id === action.payload.reportId
      );

      if (reportIndex < 0) return;

      state.childProgressionReports[reportIndex].childProgressedWith =
        action.payload.childProgressedWith;
    },
    setHowCaregiverCanHelpChild: (state, action) => {
      if (!state.childProgressionReports) return;

      const reportIndex = state.childProgressionReports.findIndex(
        (report) => report.id === action.payload.reportId
      );

      if (reportIndex < 0) return;

      state.childProgressionReports[reportIndex].howCanCaregiverHelpChild =
        action.payload.howCanCaregiverHelpChild;
    },
    saveReport: (state, action: PayloadAction<ChildProgressObservationReport>) => {
      if (!state.childProgressionReports) return;

      const reportIndex = state.childProgressionReports.findIndex(
        (report) => report.id === action.payload.id
      );

      if (reportIndex < 0) {
        state.childProgressionReports.push(action.payload);
        return;
      }

      state.childProgressionReports[reportIndex] = action.payload;
    },
    markReportForSyncing: (state, action: PayloadAction<UnSyncedReportItem>) => {
      if (!state.childProgressionReports) return;

      if (!state.unsyncedChildProgressReportsIds) state.unsyncedChildProgressReportsIds = [];

      const reportIndex = state.unsyncedChildProgressReportsIds.findIndex(
        (reportItem) => reportItem.reportId === action.payload.reportId
      );

      if (reportIndex < 0) {
        state.unsyncedChildProgressReportsIds.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserContentChildProgressReports.fulfilled, (state, action) => {
      state.childProgressionReports = action.payload.map((x) => JSON.parse(x.content));
    });

    builder.addCase(saveUserContentChildProgressReport.fulfilled, (state, action) => {
      if (!state.childProgressionReports) {
        state.childProgressionReports = [];
      }

      const reportContent = JSON.parse(action.payload.reportContent as string);

      const reportIndex = state.childProgressionReports.findIndex(
        (report) => report.id === reportContent.id
      );

      if (reportIndex && reportIndex < 0) {
        state.childProgressionReports.push(reportContent);
        return;
      }

      state.childProgressionReports[reportIndex] = reportContent;
    });
    builder.addCase(
      getChildProgressReportSummary.fulfilled,
      (state, action: PayloadAction<ChildProgressReportSummaryModel[]>) => {
        if (!state.childProgressReportSummaries) {
          state.childProgressReportSummaries = [];
        }

        state.childProgressReportSummaries = action.payload;
      }
    );
    builder.addCase(updateChildProgressReport.fulfilled, (state, action) => {
      if (!state.childProgressionReports) {
        state.childProgressionReports = [];
      }

      const reportContent = JSON.parse(action.payload.reportContent as string);

      const reportIndex = state.childProgressionReports.findIndex(
        (report) => report.id === reportContent.id
      );

      if (reportIndex && reportIndex < 0) {
        state.childProgressionReports.push(reportContent);
        return;
      }

      state.childProgressionReports[reportIndex] = reportContent;
    });

    builder.addCase(generateChildProgressReport.fulfilled, () => {});
  },
});

const { reducer: contentReportReducer, actions: contentReportActions } = contentReportSlice;

const contentReportPersistConfig = {
  key: 'contentReport',
  storage: localForage,
  blacklist: [],
};

export { contentReportPersistConfig, contentReportReducer, contentReportActions };
