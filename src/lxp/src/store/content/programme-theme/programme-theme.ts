import { createSlice } from '@reduxjs/toolkit';
import { getProgrammeThemes } from './programme-theme.actions';
import { ProgrammeThemeState } from './programme-theme.types';

const initialState: ProgrammeThemeState = {
  programmeThemes: undefined,
};

const programmeThemeSlice = createSlice({
  name: 'programmeTheme',
  initialState,
  reducers: {
    resetProgrammeThemeState: (state) => {
      state.programmeThemes = initialState.programmeThemes;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProgrammeThemes.fulfilled, (state, action) => {
      state.programmeThemes = action.payload;
    });
  },
});

const { reducer: programmeThemeReducer, actions: programmeThemeActions } = programmeThemeSlice;

export { programmeThemeReducer, programmeThemeActions };
