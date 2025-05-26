import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { PointsState } from './points.types';
import {
  getPointsSummaryForUser,
  pointsTodoItems,
  sharedData,
  yearPointsView,
} from './points.actions';

const initialState: PointsState = {
  pointsSummary: [],
  pointsLibrary: [],
  pointsToDo: undefined,
  yearPoints: undefined,
  shareData: undefined,
};

const pointsState = createSlice({
  name: 'points',
  initialState,
  reducers: {
    resetPointsState: (state) => {
      state.pointsSummary = [];
      state.pointsLibrary = [];
      state.pointsToDo = undefined;
      state.yearPoints = undefined;
      state.shareData = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPointsSummaryForUser.fulfilled, (state, action) => {
      state.pointsSummary = action.payload;
    });
    builder.addCase(pointsTodoItems.fulfilled, (state, action) => {
      state.pointsToDo = action.payload;
    });
    builder.addCase(yearPointsView.fulfilled, (state, action) => {
      state.yearPoints = action.payload;
    });
    builder.addCase(sharedData.fulfilled, (state, action) => {
      state.shareData = action.payload;
    });
  },
});

const { reducer: pointsReducer, actions: pointsActions } = pointsState;

const pointsPersistConfig = {
  key: 'points',
  storage: localForage,
  blacklist: [],
};

export { pointsPersistConfig, pointsReducer, pointsActions };
