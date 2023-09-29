import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CoachDto } from '@ecdlink/core';
import localForage from 'localforage';

import { CoachState } from './coach.types';
import {
  coachNameByUserId,
  getAllClubsForCoach,
  getAllCoachingCircleClubsForCoach,
  getCoachByCoachId,
  getCoachByUserId,
  getCoachingCircleTopics,
  updateCoachClubClicked,
} from './coach.actions';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';

const initialState: CoachState = {
  coach: undefined,
  coachCircles: undefined,
  coachClubs: undefined,
  coachCicleTopics: undefined,
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
    setThunkActionStatus(builder, updateCoachClubClicked);
    setThunkActionStatus(builder, getCoachByCoachId);
    builder.addCase(updateCoachClubClicked.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getCoachByCoachId.fulfilled, (state, action) => {
      state.coach = action.payload;
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(coachNameByUserId.fulfilled, (state, action) => {
      state.coach = action.payload;
    });
    builder.addCase(getCoachByUserId.fulfilled, (state, action) => {
      state.coach = action.payload;
    });
    builder.addCase(
      getAllCoachingCircleClubsForCoach.fulfilled,
      (state, action) => {
        state.coachCircles = action.payload;
      }
    );
    builder.addCase(getAllClubsForCoach.fulfilled, (state, action) => {
      state.coachClubs = action.payload;
    });
    builder.addCase(getCoachingCircleTopics.fulfilled, (state, action) => {
      state.coachCicleTopics = action.payload;
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
