import { PractitionerDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { getPractitionerById } from './practitioner.actions';
import { PractitionerState } from './practitioner.types';

const initialState: PractitionerState = {};

const practitionerSlice = createSlice({
  name: 'practitioner',
  initialState,
  reducers: {
    resetPractitionerState: (state) => {
      state.practitioner = initialState.practitioner;
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
