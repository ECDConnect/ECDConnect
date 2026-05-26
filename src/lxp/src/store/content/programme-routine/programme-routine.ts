import { createSlice } from '@reduxjs/toolkit';
import { getProgrammeRoutines } from './programme-routine.actions';
import { ProgrammeRoutineState } from './programme-routine.types';
import { setFulfilledThunkActionStatus } from '@/store/utils';

const initialState: ProgrammeRoutineState = {
  programmeRoutines: undefined,
};

const programmeRoutineSlice = createSlice({
  name: 'programmeRoutine',
  initialState,
  reducers: {
    resetProgrammeRoutine: (state) => {
      state.programmeRoutines = initialState.programmeRoutines;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProgrammeRoutines.fulfilled, (state, action) => {
      state.programmeRoutines = action.payload;
      setFulfilledThunkActionStatus(state, action);
    });
  },
});

const { reducer: programmeRoutineReducer, actions: programmeRoutineActions } =
  programmeRoutineSlice;

export { programmeRoutineReducer, programmeRoutineActions };
