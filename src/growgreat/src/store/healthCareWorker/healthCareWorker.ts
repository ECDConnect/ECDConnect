import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getHealthCareWorkerByUserId,
  getHealthCareWorkerPoints,
  getHealthCareWorkerTeamStanding,
  getMoreInformation,
  updateHealthCareWorker,
  updateHealthCareWorkerTabs,
  updateHealthCareWorkerWelcomeMessage,
} from './healthCareWorker.actions';
import { HealthCareWorkerState } from './healthCareWorker.types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';
import { UpdateHealthCareWorkerInputModelInput } from '@ecdlink/graphql';

const initialState: HealthCareWorkerState = {
  healthCareWorker: undefined,
  points: { data: [] },
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
    setThunkActionStatus(builder, getHealthCareWorkerPoints);
    setThunkActionStatus(builder, getHealthCareWorkerTeamStanding);
    setThunkActionStatus(builder, getMoreInformation);
    builder.addCase(getMoreInformation.fulfilled, (state, action) => {
      const locale = action?.meta?.arg?.locale;

      if (!state.points?.infoPage) {
        state.points.infoPage = [];
      }

      const existingLocaleIndex = state.points.infoPage.findIndex((infoItem) =>
        Object.hasOwnProperty.call(infoItem, locale)
      );

      if (existingLocaleIndex !== -1) {
        state.points.infoPage[existingLocaleIndex][locale] = {
          dateLoaded: new Date().toISOString(),
          data: action.payload,
        };
      } else {
        const newLocaleData = {
          [locale]: {
            dateLoaded: new Date().toISOString(),
            data: action.payload,
          },
        };
        state.points.infoPage.push(newLocaleData);
      }

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getHealthCareWorkerByUserId.fulfilled, (state, action) => {
      state.healthCareWorker = action.payload;
    });
    builder.addCase(getHealthCareWorkerPoints.fulfilled, (state, action) => {
      state.points = {
        ...state.points,
        data: action.payload,
      };

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(
      getHealthCareWorkerTeamStanding.fulfilled,
      (state, action) => {
        state.teamStanding = action.payload;

        setFulfilledThunkActionStatus(state, action);
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
