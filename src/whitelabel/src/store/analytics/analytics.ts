import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { ViewTracking, AnalyticsState, EventTracking } from './analytics.types';

const initialState: AnalyticsState = {
  viewTracking: undefined,
  eventTracking: undefined,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    resetAnalyticsState: (state) => {
      state.viewTracking = initialState.viewTracking;
      state.eventTracking = initialState.eventTracking;
    },
    createViewTracking: (state, action: PayloadAction<ViewTracking>) => {
      if (!state.viewTracking) state.viewTracking = [];
      state.viewTracking?.push(action.payload);
    },
    createEventTracking: (state, action: PayloadAction<EventTracking>) => {
      if (!state.eventTracking) state.eventTracking = [];
      state.eventTracking?.push(action.payload);
    },
  },
});

const { reducer: analyticsReducer, actions: analyticsActions } = analyticsSlice;

const analyticsPersistConfig = {
  key: 'analytics',
  storage: localForage,
  blacklist: [],
};

export { analyticsPersistConfig, analyticsReducer, analyticsActions };
