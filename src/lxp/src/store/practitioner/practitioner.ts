import { PractitionerDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getAllPractitioners,
  getPractitionerById,
  getPractitionersForCoach,
} from './practitioner.actions';
import {
  PractitionerState,
  PrincipalPractitioners,
} from './practitioner.types';

const initialState: PractitionerState = {
  practitioner: undefined,
  practitioners: undefined,
};

const practitionerSlice = createSlice({
  name: 'practitioner',
  initialState,
  reducers: {
    resetPractitionerState: (state) => {
      state.practitioner = initialState.practitioner;
      state.practitioners = initialState.practitioners;
    },
    addPrincipalPractitioners: (
      state,
      action: PayloadAction<PrincipalPractitioners[]>
    ) => {
      state.principalPractitioners = action.payload;
    },
    updatePractitioner: (state, action: PayloadAction<PractitionerDto>) => {
      if (state.practitioner) {
        state.practitioner = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPractitionerById.fulfilled, (state, action) => {
      state.practitioner = action.payload;
    });
    // builder.addCase(getPractitionersForCoach.fulfilled, (state, action) => {
    //   state.practitioners = action.payload;
    // });
    builder.addCase(getAllPractitioners.fulfilled, (state, action) => {
      state.practitioners = action.payload;
    });
  },
});

const { reducer: practitionerReducer, actions: practitionerActions } =
  practitionerSlice;

const practitionerPersistConfig = {
  key: 'practitioner',
  storage: localForage,
  blacklist: [],
};

export { practitionerPersistConfig, practitionerReducer, practitionerActions };
