import { CaregiverDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  createCaregiver,
  getCaregiverClients,
  getCaregivers,
  getCaregiversForHealthCareWorker,
  updateCaregiver,
} from './caregiver.actions';
import { CaregiverContactHistory, CaregiverState } from './caregiver.types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';

const initialState: CaregiverState = {};

const caregiverSlice = createSlice({
  name: 'caregiver',
  initialState,
  reducers: {
    resetCaregiverState: (state) => {
      state.caregivers = initialState.caregivers;
    },
    createCaregiver: (state, action: PayloadAction<CaregiverDto>) => {
      if (!state.caregivers) state.caregivers = [];

      if (!state.caregivers?.find((item) => item?.id === action.payload?.id)) {
        state.caregivers?.push(action.payload);
      }
    },
    updateCaregiver: (state, action: PayloadAction<CaregiverDto>) => {
      if (state.caregivers) {
        for (let i = 0; i < state.caregivers.length; i++) {
          if (state.caregivers[i].id === action.payload.id)
            state.caregivers[i] = action.payload;
        }
      }
    },
    updateCaregiverContactHistory: (
      state,
      action: PayloadAction<CaregiverContactHistory[]>
    ) => {
      state.contactHistory = action.payload;
    },
    addContactHistory: (
      state,
      action: PayloadAction<CaregiverContactHistory>
    ) => {
      if (!state.contactHistory) state.contactHistory = [];

      state.contactHistory.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, getCaregiverClients);
    builder.addCase(getCaregivers.fulfilled, (state, action) => {
      if (!state.caregivers) {
        const caregivers = Object.assign([], action.payload) as CaregiverDto[];

        for (let i = 0; i < caregivers.length; i++) {
          caregivers[i].isActive = true;
        }

        state.caregivers = caregivers;
      }
    });
    builder.addCase(
      getCaregiversForHealthCareWorker.fulfilled,
      (state, action) => {
        if (!state.caregivers) {
          const caregivers = Object.assign(
            [],
            action.payload
          ) as CaregiverDto[];

          for (let i = 0; i < caregivers.length; i++) {
            caregivers[i].isActive = true;
          }

          state.caregivers = caregivers;
        }
      }
    );
    builder.addCase(
      updateCaregiver.fulfilled,
      (state, action: PayloadAction<CaregiverDto>) => {
        if (state.caregivers) {
          const caregiverIndex = state.caregivers.findIndex(
            (caregiver) => caregiver.id === action.payload.id
          );

          if (caregiverIndex < 0) return;

          state.caregivers[caregiverIndex] = action.payload;
        }
      }
    );
    builder.addCase(
      createCaregiver.fulfilled,
      (state, action: PayloadAction<CaregiverDto>) => {
        if (!state.caregivers) state.caregivers = [];
        state.caregivers
          ?.filter((item) => item?.id !== action.payload?.id)
          .push(action.payload);
      }
    );
    builder.addCase(getCaregiverClients.fulfilled, (state, action) => {
      if (!!state.caregiverClientsList?.length) {
        if (
          !state.caregiverClientsList?.find(
            (item) => item?.caregiverId === action.payload?.caregiverId
          )
        ) {
          state.caregiverClientsList?.push(action.payload);
        }

        state.caregiverClientsList = state.caregiverClientsList.map(
          (caregiver) => {
            if (caregiver.caregiverId === action.payload.caregiverId) {
              return action.payload;
            } else {
              return caregiver;
            }
          }
        );
      }

      state.caregiverClientsList = [action.payload];
      setFulfilledThunkActionStatus(state, action);
    });
  },
});

const { reducer: caregiverReducer, actions: caregiverActions } = caregiverSlice;

const caregiverPersistConfig = {
  key: 'caregiver',
  storage: localForage,
  blacklist: [],
};

export { caregiverPersistConfig, caregiverReducer, caregiverActions };
