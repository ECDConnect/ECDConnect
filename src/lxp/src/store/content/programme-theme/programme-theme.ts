import { createSlice } from '@reduxjs/toolkit';
import { getProgrammeThemes } from './programme-theme.actions';
import { ProgrammeThemeState } from './programme-theme.types';
import {
  setFulfilledThunkActionStatus,
  setThunkActionStatus,
} from '@/store/utils';
import localforage from 'localforage';

const initialState: ProgrammeThemeState = {
  programmeThemes: undefined,
};

const programmeThemeSlice = createSlice({
  name: 'programmeTheme',
  initialState,
  reducers: {
    // resetProgrammeThemeState: (state) => {
    //   state.programmeThemes = initialState.programmeThemes;
    // },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, getProgrammeThemes);
    builder.addCase(getProgrammeThemes.fulfilled, (state, action) => {
      state.programmeThemes = action.payload;
      setFulfilledThunkActionStatus(state, action);
    });
  },
});

const { reducer: programmeThemeReducer, actions: programmeThemeActions } =
  programmeThemeSlice;

const programmeThemePersistConfig = {
  key: 'programmeTheme',
  storage: localforage,
  blacklist: [],
};

export {
  programmeThemePersistConfig,
  programmeThemeReducer,
  programmeThemeActions,
};
