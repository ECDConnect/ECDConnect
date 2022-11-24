import { HealthCareWorkerDto, PractitionerDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getHealthCareWorkerByUserId,
  updateHealthCareWorkerById,
} from './healthCareWorker.actions';
import { HealthCareWorkerState } from './healthCareWorker.types';

const initialState: HealthCareWorkerState = {
  healthCareWorker: undefined,
  healthCareWorkers: undefined,
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
    // builder.addCase(getAllPractitioners.fulfilled, (state, action) => {
    //   state.healthCareWorkers = action.payload;
    // });
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
