import { PractitionerDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getAllPractitioner,
  getPractitionerById,
  getPractitionersForCoach,
} from './practitioner.actions';
import { PractitionerState } from './practitioner.types';

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
    updatePractitioner: (state, action: PayloadAction<PractitionerDto>) => {
      if (state.practitioner) {
        state.practitioner = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(getCaregivers.fulfilled, (state, action) => {
    //   if (!state.caregivers) {
    //     const caregivers = Object.assign([], action.payload) as CaregiverDto[];

    //     for (let i = 0; i < caregivers.length; i++) {
    //       caregivers[i].isActive = true;
    //     }

    //     state.caregivers = caregivers;
    //   }
    builder.addCase(getAllPractitioner.fulfilled, (state, action) => {
      console.log(action.payload);
      if (!state.practitioners) {
        const practitioners = Object.assign(
          [],
          action.payload
        ) as PractitionerDto[];

        // for (let i = 0; i < practitioners.length; i++) {
        //   practitioners[i].isActive = true;
        // }

        // state.practitioners = action.payload;
        state.practitioners = practitioners;
      }
    });

    builder.addCase(getPractitionerById.fulfilled, (state, action) => {
      state.practitioner = action.payload;
    });

    // builder.addCase(getPractitionersForCoach.fulfilled, (state, action) => {
    //   state.practitioners = action.payload;
    // });
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
