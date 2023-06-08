import { PractitionerDto, TraineeDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { getTraineeById, getTraineeTimeline } from './trainee.actions';
import { TraineeState } from './trainee.types';

const initialState: TraineeState = {
  trainee: undefined,
  traineeOnboardTimeline: undefined,
};

const traineeSlice = createSlice({
  name: 'trainee',
  initialState,
  reducers: {
    resetPractitionerState: (state) => {
      state.trainee = initialState.trainee;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTraineeById.fulfilled, (state, action) => {
      state.trainee = action.payload;
    });
    builder.addCase(getTraineeTimeline.fulfilled, (state, action) => {
      console.log(action.payload);
      state.traineeOnboardTimeline = action.payload;
    });
  },
});

const { reducer: traineerReducer, actions: traineeActions } = traineeSlice;

const traineePersistConfig = {
  key: 'trainee',
  storage: localForage,
  blacklist: [],
};

export { traineePersistConfig, traineerReducer, traineeActions };
