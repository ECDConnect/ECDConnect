import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { getProgrammeRoutines } from './programme-routine.actions';
import { ProgrammeRoutineState } from './programme-routine.types';

const initialState: ProgrammeRoutineState = {
  programmeRoutines: undefined,
};

const programmeRoutineSlice = createSlice({
  name: 'programmeRoutine',
  initialState,
  reducers: {
    resetProgrammeRoutineState: (state) => {
      state.programmeRoutines = initialState.programmeRoutines;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProgrammeRoutines.fulfilled, (state, action) => {
      state.programmeRoutines = action.payload;
    });
  },
});

const { reducer: programmeRoutineReducer, actions: programmeRoutineActions } =
  programmeRoutineSlice;

const programmeRoutinePersistConfig = {
  key: 'programmeRoutine',
  storage: localForage,
  blacklist: [],
};

export {
  programmeRoutinePersistConfig,
  programmeRoutineReducer,
  programmeRoutineActions,
};
