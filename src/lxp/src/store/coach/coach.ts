import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CoachDto } from '@ecdlink/core';
import localForage from 'localforage';

import { CoachState } from './coach.types';
import { getCoachByCoachId } from './coach.actions';

const initialState: CoachState = {
  coach: undefined,
};

const coachSlice = createSlice({
  name: 'coach',
  initialState,
  reducers: {
    resetCoachState: (state) => {
      state.coach = initialState.coach;
    },
    updateCoach: (state, action: PayloadAction<CoachDto>) => {
      if (state.coach) {
        state.coach = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCoachByCoachId.fulfilled, (state, action) => {
      state.coach = action.payload;
    });
  },
});

const { reducer: coachReducer, actions: coachActions } = coachSlice;

const coachPersistConfig = {
  key: 'coach',
  storage: localForage,
  blacklist: [],
};

export { coachPersistConfig, coachReducer, coachActions };
