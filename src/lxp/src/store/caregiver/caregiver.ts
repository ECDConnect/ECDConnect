import { CaregiverDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  createCaregiver,
  getCaregivers,
  updateCaregiver,
} from './caregiver.actions';
import { CaregiverContactHistory, CaregiverState } from './caregiver.types';

const initialState: CaregiverState = {};

const caregiverSlice = createSlice({
  name: 'caregiver',
  initialState,
  reducers: {
    resetCaregiverState: (state) => {
      state.caregivers = initialState.caregivers;
    },
    createCaregiver: (state, action: PayloadAction<CaregiverDto>) => {
      const isOnline = navigator.onLine;
      const payloadUpdated = { ...action.payload, isOnline };
      if (!state.caregivers) state.caregivers = [];
      state.caregivers?.push(payloadUpdated);
    },
    updateCaregiver: (state, action: PayloadAction<CaregiverDto>) => {
      if (state.caregivers) {
        const isOnline = navigator.onLine;
        const payloadUpdated = { ...action.payload, isOnline };

        for (let i = 0; i < state.caregivers.length; i++) {
          if (state.caregivers[i].id === action.payload.id)
            state.caregivers[i] = payloadUpdated;
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
        state.caregivers?.push(action.payload);
      }
    );
  },
});

const { reducer: caregiverReducer, actions: caregiverActions } = caregiverSlice;

const caregiverPersistConfig = {
  key: 'caregiver',
  storage: localForage,
  blacklist: [],
};

export { caregiverPersistConfig, caregiverReducer, caregiverActions };
