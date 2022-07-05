import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCoachById } from './coach.actions';
import { CoachDto } from '@ecdlink/core';
import { CoachState } from './coach.types';
import localForage from 'localforage';

const initialState: CoachState = {};

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
    builder.addCase(getCoachById.fulfilled, (state, action) => {
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
