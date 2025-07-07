import {
  ChildProgressObservationReport,
  ChildProgressReportSummaryModel,
} from '@ecdlink/core';
import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { ContentReportState, UnSyncedReportItem } from './report.types';
import { reportConvert } from './report.util';
const initialState: ContentReportState = {
  childProgressionReports: [],
  unsyncedChildProgressReportsIds: [],
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
  },
  extraReducers: (builder) => {},
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
