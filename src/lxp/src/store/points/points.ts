import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { PointsState } from './points.types';
import {
  getPointsLibrary,
  getPointsSummaryForUser,
  getUserClubStanding,
  pointsTodoItems,
} from './points.actions';

const initialState: PointsState = {
  pointsSummary: [],
  pointsLibrary: [],
  userClubStanding: undefined,
  pointsToDo: undefined,
};

const pointsState = createSlice({
  name: 'points',
  initialState,
  reducers: {
    resetPointsState: (state) => {
      state.pointsSummary = [];
      state.pointsLibrary = [];
      state.userClubStanding = undefined;
      state.pointsToDo = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPointsSummaryForUser.fulfilled, (state, action) => {
      state.pointsSummary = action.payload;
    });
    builder.addCase(getPointsLibrary.fulfilled, (state, action) => {
      state.pointsLibrary = action.payload;
    });
    builder.addCase(getUserClubStanding.fulfilled, (state, action) => {
      state.userClubStanding = {
        standing: action.payload,
        dateLoaded: new Date().toISOString(),
      };
    });
    builder.addCase(pointsTodoItems.fulfilled, (state, action) => {
      state.pointsToDo = action.payload;
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
