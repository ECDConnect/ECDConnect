import { ProgrammeDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { getProgrammes } from './programme.actions';
import { ProgrammeState, UpdateProgramme, UpdateProgrammeDay } from './programme.types';

const initialState: ProgrammeState = {};

const programmeSlice = createSlice({
  name: 'programme',
  initialState,
  reducers: {
    resetProgrammeState: (state) => {
      state.programmes = initialState.programmes;
    },
    createProgramme: (state, action: PayloadAction<ProgrammeDto>) => {
      if (!state.programmes) state.programmes = [];

      state.programmes?.push(action.payload);
    },
    updateProgramme: (state, action: PayloadAction<UpdateProgramme>) => {
      if (!state.programmes) return;

      const indexOfProgramme = state.programmes.findIndex(
        (programme) => programme.id === action.payload.programme.id
      );

      if (indexOfProgramme < 0) return;

      state.programmes[indexOfProgramme] = action.payload.programme;
    },
    updateProgrammeDay: (state, action: PayloadAction<UpdateProgrammeDay>) => {
      if (!state.programmes) return;

      const indexOfProgramme = state.programmes.findIndex(
        (programme) => programme.id === action.payload.programmeId
      );

      if (indexOfProgramme < 0) return;

      const programmeDays = state.programmes[indexOfProgramme].dailyProgrammes;

      const indexOfDay = programmeDays.findIndex(
        (day) => day.day === action.payload.programmeDay.day
      );

      if (indexOfDay < 0) return;

      state.programmes[indexOfProgramme].dailyProgrammes[indexOfDay] = action.payload.programmeDay;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProgrammes.fulfilled, (state, action) => {
      state.programmes = action.payload;
    });
  },
});

const { reducer: programmeReducer, actions: programmeActions } = programmeSlice;

const programmePersistConfig = {
  key: 'programme',
  storage: localForage,
  blacklist: [],
};

export { programmePersistConfig, programmeReducer, programmeActions };
