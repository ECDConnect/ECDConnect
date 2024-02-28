import { HealthCareWorkerDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getHealthCareWorkerByUserId,
  updateHealthCareWorkerById,
  updateHealthCareWorkerTabs,
} from './healthCareWorker.actions';
import { HealthCareWorkerState } from './healthCareWorker.types';

const initialState: HealthCareWorkerState = {
  healthCareWorker: undefined,
  healthCareWorkers: undefined, // Is this used? Can it be removed?
};

const healthCareWorkerSlice = createSlice({
  name: 'healthCareWorker',
  initialState,
  reducers: {
    resetHealthCareWorkerState: (state) => {
      state.healthCareWorker = initialState.healthCareWorker;
      state.healthCareWorkers = initialState.healthCareWorkers;
    },
    updateHealthCareWorker: (
      state,
      action: PayloadAction<HealthCareWorkerDto>
    ) => {
      if (state.healthCareWorker) {
        state.healthCareWorker = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getHealthCareWorkerByUserId.fulfilled, (state, action) => {
      state.healthCareWorker = action.payload;
    });
    builder.addCase(updateHealthCareWorkerById.fulfilled, (state, action) => {
      state.healthCareWorker = action.payload;
    });
    builder.addCase(updateHealthCareWorkerTabs.fulfilled, (state, action) => {
      state.healthCareWorker = action.payload;
    });
  },
});

const { reducer: healthCareWorkerReducer, actions: healthCareWorkerActions } =
  healthCareWorkerSlice;

const healthCareWorkerPersistConfig = {
  key: 'healthCareWorker',
  storage: localForage,
  blacklist: [],
};

export {
  healthCareWorkerPersistConfig,
  healthCareWorkerReducer,
  healthCareWorkerActions,
};
