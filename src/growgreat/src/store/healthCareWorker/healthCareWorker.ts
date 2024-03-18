import { HealthCareWorkerDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getHealthCareWorkerByUserId,
  getHealthCareWorkerPoints,
  gethealthCareWorkerTeamStanding,
  updateHealthCareWorker,
  updateHealthCareWorkerTabs,
  updateHealthCareWorkerWelcomeMessage,
} from './healthCareWorker.actions';
import { HealthCareWorkerState } from './healthCareWorker.types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';
import { UpdateHealthCareWorkerInputModelInput } from '@ecdlink/graphql';

const initialState: HealthCareWorkerState = {
  healthCareWorker: undefined,
  points: [],
};

const healthCareWorkerSlice = createSlice({
  name: 'healthCareWorker',
  initialState,
  reducers: {
    resetHealthCareWorkerState: (state) => {
      state.healthCareWorker = initialState.healthCareWorker;
    },
    updateHealthCareWorker: (
      state,
      action: PayloadAction<UpdateHealthCareWorkerInputModelInput>
    ) => {
      if (state.healthCareWorker) {
        state.healthCareWorker = {
          ...state.healthCareWorker,
          isRegistered: action.payload.isRegistered,
          languageId: action.payload.languageId,
        };
      }
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, updateHealthCareWorkerWelcomeMessage);
    setThunkActionStatus(builder, updateHealthCareWorker);
    builder.addCase(getHealthCareWorkerByUserId.fulfilled, (state, action) => {
      state.healthCareWorker = action.payload;
    });
    builder.addCase(getHealthCareWorkerPoints.fulfilled, (state, action) => {
      state.points = action.payload;
    });
    builder.addCase(
      gethealthCareWorkerTeamStanding.fulfilled,
      (state, action) => {
        state.teamStanding = action.payload;
      }
    );
    builder.addCase(updateHealthCareWorker.fulfilled, (state, action) => {
      state.healthCareWorker = {
        ...state.healthCareWorker,
        ...action.payload,
      };

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(updateHealthCareWorkerTabs.fulfilled, (state, action) => {
      state.healthCareWorker = action.payload;
    });
    builder.addCase(
      updateHealthCareWorkerWelcomeMessage.fulfilled,
      (state, action) => {
        state.healthCareWorker = {
          ...state.healthCareWorker,
          ...action.payload,
        };

        setFulfilledThunkActionStatus(state, action);
      }
    );
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
