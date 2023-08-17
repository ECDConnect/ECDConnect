import {
  ChildProgressObservationReport,
  ChildProgressReportSummaryModel,
} from '@ecdlink/core';
import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  generateChildProgressReport,
  getChildProgressReportSummary,
  getDetailedProgressReports,
  getUserContentChildProgressReports,
  saveUserContentChildProgressReport,
  updateChildProgressReport,
} from './report.actions';
import { ContentReportState, UnSyncedReportItem } from './report.types';
import { reportConvert } from './report.util';
const initialState: ContentReportState = {
  childProgressionReports: [],
  unsyncedChildProgressReportsIds: [],
};

const _markReportForSyncing = (
  state: Draft<ContentReportState>,
  payload: UnSyncedReportItem
) => {
  if (!state.childProgressionReports) return;

  if (!state.unsyncedChildProgressReportsIds)
    state.unsyncedChildProgressReportsIds = [];

  const reportIndex = state.unsyncedChildProgressReportsIds.findIndex(
    (reportItem) => reportItem.reportId === payload.reportId
  );

  if (reportIndex < 0) {
    state.unsyncedChildProgressReportsIds.push(payload);
  } else {
    state.unsyncedChildProgressReportsIds[reportIndex].promptUser =
      payload.promptUser || false;
  }
};

const _reportSynced = (state: Draft<ContentReportState>, reportId: string) => {
  if (!state.childProgressionReports) return;

  if (!state.unsyncedChildProgressReportsIds)
    state.unsyncedChildProgressReportsIds = [];

  const reportIndex = state.unsyncedChildProgressReportsIds.findIndex(
    (reportItem) => reportItem.reportId === reportId
  );

  if (reportIndex < 0) return;

  state.unsyncedChildProgressReportsIds.splice(reportIndex, 1);
};

const contentReportSlice = createSlice({
  name: 'contentReport',
  initialState,
  reducers: {
    resetContentReportState: (state) => {
      state.childProgressionReports =
        initialState.childProgressionReports || [];
      state.unsyncedChildProgressReportsIds =
        initialState.unsyncedChildProgressReportsIds || [];
    },
    setSkillsForCategory: (state, action) => {
      if (!state.childProgressionReports) return;

      const reportIndex = (state.childProgressionReports || []).findIndex(
        (report) => report.id === action.payload.reportId
      );

      if (reportIndex < 0) return;

      const categoryIndex = (state.childProgressionReports || [])[
        reportIndex
      ]?.categories.findIndex(
        (cat: any) => cat.categoryId === action.payload.categoryId
      );
      if (categoryIndex < 0) return;

      state.childProgressionReports[reportIndex].categories[
        categoryIndex
      ].tasks = action.payload.tasks;
      state.childProgressionReports[reportIndex].categories[
        categoryIndex
      ].missingTasks = action.payload.missingTasks;

      _markReportForSyncing(state, {
        reportId: action.payload.reportId,
        classroomGroupId: action.payload.classroomGroupId || null,
        promptUser: false,
      });
    },
    setCategoryStatus: (state, action) => {
      if (!state.childProgressionReports) return;

      const reportIndex = state.childProgressionReports.findIndex(
        (report) => report.id === action.payload.reportId
      );

      if (reportIndex < 0) return;

      const categoryIndex = state.childProgressionReports[
        reportIndex
      ]?.categories.findIndex(
        (cat: any) => cat.categoryId === action.payload.categoryId
      );
      if (categoryIndex < 0) return;

      state.childProgressionReports[reportIndex].categories[
        categoryIndex
      ].status = action.payload.status;

      _markReportForSyncing(state, {
        reportId: action.payload.reportId,
        classroomGroupId: action.payload.classroomGroupId || null,
        promptUser: false,
      });
    },
    setCategoryAchievedLevelId: (state, action) => {
      if (!state.childProgressionReports) return;

      const reportIndex = state.childProgressionReports.findIndex(
        (report) => report.id === action.payload.reportId
      );

      if (reportIndex < 0) return;

      const categoryIndex = state.childProgressionReports[
        reportIndex
      ]?.categories.findIndex(
        (cat: any) => cat.categoryId === action.payload.categoryId
      );
      if (categoryIndex < 0) return;

      state.childProgressionReports[reportIndex].categories[
        categoryIndex
      ].achievedLevelId = action.payload.levelId;

      _markReportForSyncing(state, {
        reportId: action.payload.reportId,
        classroomGroupId: action.payload.classroomGroupId || null,
        promptUser: false,
      });
    },
    setCategorySupportTask: (state, action) => {
      if (!state.childProgressionReports) return;

      const reportIndex = state.childProgressionReports.findIndex(
        (report) => report.id === action.payload.reportId
      );

      if (reportIndex < 0) return;

      const categoryIndex = state.childProgressionReports[
        reportIndex
      ]?.categories.findIndex(
        (cat: any) => cat.categoryId === action.payload.categoryId
      );
      if (categoryIndex < 0) return;

      const currentCategory =
        state.childProgressionReports[reportIndex].categories[categoryIndex];

      if (!currentCategory) return;

      state.childProgressionReports[reportIndex].categories[
        categoryIndex
      ].supportingTask = action.payload.supportingTask;

      _markReportForSyncing(state, {
        reportId: action.payload.reportId,
        classroomGroupId: action.payload.classroomGroupId || null,
        promptUser: false,
      });
    },
    setReportObservationNote: (state, action) => {
      if (!state.childProgressionReports) return;

      const reportIndex = state.childProgressionReports.findIndex(
        (report) => report.id === action.payload.reportId
      );

      if (reportIndex < 0) return;

      state.childProgressionReports[reportIndex].observationNote =
        action.payload.note;

      _markReportForSyncing(state, {
        reportId: action.payload.reportId,
        classroomGroupId: action.payload.classroomGroupId || null,
        promptUser: false,
      });
    },
    setChildEnjoys: (state, action) => {
      if (!state.childProgressionReports) return;

      const reportIndex = state.childProgressionReports.findIndex(
        (report) => report.id === action.payload.reportId
      );

      if (reportIndex < 0) return;

      state.childProgressionReports[reportIndex].childEnjoys =
        action.payload.childEnjoys;

      _markReportForSyncing(state, {
        reportId: action.payload.reportId,
        classroomGroupId: action.payload.classroomGroupId || null,
        promptUser: false,
      });
    },
    setChildProgressedWith: (state, action) => {
      if (!state.childProgressionReports) return;

      const reportIndex = state.childProgressionReports.findIndex(
        (report) => report.id === action.payload.reportId
      );

      if (reportIndex < 0) return;

      state.childProgressionReports[reportIndex].childProgressedWith =
        action.payload.childProgressedWith;

      _markReportForSyncing(state, {
        reportId: action.payload.reportId,
        classroomGroupId: action.payload.classroomGroupId || null,
        promptUser: false,
      });
    },
    setHowCaregiverCanHelpChild: (state, action) => {
      if (!state.childProgressionReports) return;

      const reportIndex = state.childProgressionReports.findIndex(
        (report) => report.id === action.payload.reportId
      );

      if (reportIndex < 0) return;

      state.childProgressionReports[reportIndex].howCanCaregiverHelpChild =
        action.payload.howCanCaregiverHelpChild;

      _markReportForSyncing(state, {
        reportId: action.payload.reportId,
        classroomGroupId: action.payload.classroomGroupId || null,
        promptUser: false,
      });
    },
    saveReport: (
      state,
      action: PayloadAction<ChildProgressObservationReport>
    ) => {
      if (!state.childProgressionReports || !state.childProgressReportSummaries)
        return;

      const report = action.payload;
      const reportIndex = state.childProgressionReports.findIndex(
        (r) => r.id === report.id
      );
      if (reportIndex < 0) {
        state.childProgressionReports.push(report);
        return;
      }
      state.childProgressionReports[reportIndex] = report;

      const summary =
        reportConvert.ChildProgressObservationReport.ChildProgressReportSummaryModel(
          report
        );
      const summaryIndex = state.childProgressReportSummaries.findIndex(
        (s) => s.reportId === summary.reportId
      );
      if (summaryIndex < 0) {
        state.childProgressReportSummaries.push(summary);
      }
      state.childProgressReportSummaries[summaryIndex] = summary;
    },
    markReportForSyncing: (
      state,
      action: PayloadAction<UnSyncedReportItem>
    ) => {
      if (action.payload.promptUser === undefined)
        action.payload.promptUser = true;
      _markReportForSyncing(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getUserContentChildProgressReports.fulfilled,
      (state, action) => {
        state.childProgressionReports = action.payload.map((x) =>
          JSON.parse(x.content)
        );
      }
    );

    builder.addCase(
      saveUserContentChildProgressReport.fulfilled,
      (state, action) => {
        if (!state.childProgressionReports) {
          state.childProgressionReports = [];
        }
        if (!state.childProgressReportSummaries) {
          state.childProgressReportSummaries = [];
        }

        const report: ChildProgressObservationReport = JSON.parse(
          action.payload.reportContent as string
        );
        const reportIndex = state.childProgressionReports.findIndex(
          (r) => r.id === report.id
        );
        if (reportIndex < 0) {
          state.childProgressionReports.push(report);
        } else {
          state.childProgressionReports[reportIndex] = report;
        }

        const summary =
          reportConvert.ChildProgressObservationReport.ChildProgressReportSummaryModel(
            report
          );
        const summaryIndex = state.childProgressReportSummaries.findIndex(
          (s) => s.reportId === summary.reportId
        );
        if (summaryIndex < 0) {
          state.childProgressReportSummaries.push(summary);
        }
        state.childProgressReportSummaries[summaryIndex] = summary;

        _reportSynced(state, report.id);
      }
    );
    builder.addCase(
      getDetailedProgressReports.fulfilled,
      (state, action: PayloadAction<ChildProgressObservationReport[]>) => {
        if (!state.childProgressionReports) {
          state.childProgressionReports = [];
        }

        state.childProgressionReports = action.payload;
      }
    );
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

      _reportSynced(state, reportContent.id);
    });

    builder.addCase(generateChildProgressReport.fulfilled, () => {});
  },
});

const { reducer: contentReportReducer, actions: contentReportActions } =
  contentReportSlice;

const contentReportPersistConfig = {
  key: 'contentReport',
  storage: localForage,
  blacklist: [],
};

export {
  contentReportPersistConfig,
  contentReportReducer,
  contentReportActions,
};
