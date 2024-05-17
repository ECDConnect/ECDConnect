import { CaregiverDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { createCaregiver, updateCaregiver } from './caregiver.actions';
import { CaregiverState } from './caregiver.types';
import { setFulfilledThunkActionStatus } from '../utils';

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
  },
  extraReducers: (builder) => {
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

        setFulfilledThunkActionStatus(state, action);
      }
    );
    // TODO: move to children state
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
