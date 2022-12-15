import { PractitionerDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getPractitionerById,
  getPractitionersForCoach,
} from './practitionerForCoach.actions';
import { PractitionerForCoachState } from './practitionerForCoach.types';

const initialState: PractitionerForCoachState = {
  practitionerForCoach: undefined,
  practitionersForCoach: undefined,
};

const practitionerForCoachSlice = createSlice({
  name: 'practitionerForCoach',
  initialState,
  reducers: {
    resetPractitionerState: (state) => {
      state.practitionerForCoach = initialState.practitionerForCoach;
      state.practitionersForCoach = initialState.practitionersForCoach;
    },
    updatePractitioner: (state, action: PayloadAction<PractitionerDto>) => {
      if (state.practitionerForCoach) {
        state.practitionerForCoach = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPractitionerById.fulfilled, (state, action) => {
      state.practitionerForCoach = action.payload;
    });

    builder.addCase(getPractitionersForCoach.fulfilled, (state, action) => {
      if (!state.practitionersForCoach) {
        const practitionersForCoach = Object.assign(
          [],
          action.payload
        ) as PractitionerDto[];

        state.practitionersForCoach = practitionersForCoach;
      }
    });
  },
});

const {
  reducer: practitionerForCoachReducer,
  actions: practitionerForCoachActions,
} = practitionerForCoachSlice;

const practitionerForCoachPersistConfig = {
  key: 'practitionerForCoach',
  storage: localForage,
  blacklist: [],
};

export {
  practitionerForCoachPersistConfig,
  practitionerForCoachReducer,
  practitionerForCoachActions,
};
