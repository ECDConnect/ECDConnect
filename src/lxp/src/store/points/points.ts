import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { PointsState } from './points.types';
import { getPointsSummaryForUser } from './points.actions';

const initialState: PointsState = {
  pointsSummary: [],
};

const pointsState = createSlice({
  name: 'points',
  initialState,
  reducers: {
    resetPointsState: (state) => {
      state.pointsSummary = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPointsSummaryForUser.fulfilled, (state, action) => {
      state.pointsSummary = action.payload;
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
