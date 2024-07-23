import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getDocumentTypes,
  getEducationLevels,
  getGenders,
  getHolidays,
  getLanguages,
  getNoteTypes,
  getProvinces,
  getRaces,
  getReasonsForLeaving,
  getRelations,
  getWorkflowStatuses,
} from './static-data.actions';
import { StaticDataState } from './static-data.types';

const initialState: StaticDataState = {
  relations: undefined,
  gender: undefined,
  languages: undefined,
  races: undefined,
  educationLevels: undefined,
  holidays: undefined,
  provinces: undefined,
  reasonForLeaving: undefined,
  documentTypes: undefined,
  WorkflowStatuses: undefined,
  noteTypes: undefined,
  permissions: undefined,
};

const staticDataSlice = createSlice({
  name: 'staticData',
  initialState,
  reducers: {
    resetStaticDataState: (state) => {
      state.relations = initialState.relations;
      state.gender = initialState.gender;
      state.languages = initialState.languages;
      state.races = initialState.races;
      state.educationLevels = initialState.educationLevels;
      state.holidays = initialState.holidays;
      state.provinces = initialState.provinces;
      state.reasonForLeaving = initialState.reasonForLeaving;
      state.documentTypes = initialState.documentTypes;
      state.noteTypes = initialState.noteTypes;
      state.permissions = initialState.permissions;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRelations.fulfilled, (state, action) => {
      state.relations = action.payload;
    });
    builder.addCase(getGenders.fulfilled, (state, action) => {
      state.gender = action.payload;
    });
    builder.addCase(getRaces.fulfilled, (state, action) => {
      state.races = action.payload;
    });
    builder.addCase(getLanguages.fulfilled, (state, action) => {
      state.languages = action.payload;
    });
    builder.addCase(getEducationLevels.fulfilled, (state, action) => {
      state.educationLevels = action.payload;
    });
    builder.addCase(getHolidays.fulfilled, (state, action) => {
      state.holidays = action.payload;
    });
    builder.addCase(getProvinces.fulfilled, (state, action) => {
      state.provinces = action.payload;
    });
    builder.addCase(getReasonsForLeaving.fulfilled, (state, action) => {
      state.reasonForLeaving = action.payload;
    });
    builder.addCase(getDocumentTypes.fulfilled, (state, action) => {
      state.documentTypes = action.payload;
    });
    builder.addCase(getNoteTypes.fulfilled, (state, action) => {
      state.noteTypes = action.payload;
    });
    builder.addCase(getWorkflowStatuses.fulfilled, (state, action) => {
      state.WorkflowStatuses = action.payload;
    });
  },
});

const { reducer: staticDataReducer, actions: staticDataActions } =
  staticDataSlice;

const staticDataPersistConfig = {
  key: 'staticData',
  storage: localForage,
  blacklist: [],
};

export { staticDataPersistConfig, staticDataReducer, staticDataActions };
