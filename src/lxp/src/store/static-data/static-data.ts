import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getDocumentTypes,
  getEducationLevels,
  getGenders,
  getGrants,
  getHolidays,
  getLanguages,
  getNoteTypes,
  getPermissions,
  getProgrammeAttendanceReasons,
  getProgrammeTypes,
  getProvinces,
  getRaces,
  getReasonsForLeaving,
  getReasonsForPractitionerLeaving,
  getReasonsForPractitionerLeavingProgramme,
  getRelations,
  getWorkflowStatuses,
  getRoles,
  getCommunitySkills,
} from './static-data.actions';
import { StaticDataState } from './static-data.types';

const initialState: StaticDataState = {
  relations: undefined,
  programmeTypes: undefined,
  programmeAttendanceReason: undefined,
  gender: undefined,
  languages: undefined,
  races: undefined,
  educationLevels: undefined,
  holidays: undefined,
  provinces: undefined,
  reasonForLeaving: undefined,
  reasonForPractitionerLeaving: undefined,
  reasonForPractitionerLeavingProgramme: undefined,
  grants: undefined,
  documentTypes: undefined,
  WorkflowStatuses: undefined,
  noteTypes: undefined,
  permissions: undefined,
  roles: undefined,
  communitySkills: undefined,
};

const staticDataSlice = createSlice({
  name: 'staticData',
  initialState,
  reducers: {
    resetStaticDataState: (state) => {
      state.relations = initialState.relations;
      state.programmeTypes = initialState.programmeTypes;
      state.programmeAttendanceReason = initialState.programmeAttendanceReason;
      state.gender = initialState.gender;
      state.languages = initialState.languages;
      state.races = initialState.races;
      state.educationLevels = initialState.educationLevels;
      state.holidays = initialState.holidays;
      state.provinces = initialState.provinces;
      state.reasonForLeaving = initialState.reasonForLeaving;
      state.reasonForPractitionerLeaving =
        initialState.reasonForPractitionerLeaving;
      state.reasonForPractitionerLeavingProgramme =
        initialState.reasonForPractitionerLeavingProgramme;
      state.grants = initialState.grants;
      state.documentTypes = initialState.documentTypes;
      state.WorkflowStatuses = initialState.WorkflowStatuses;
      state.noteTypes = initialState.noteTypes;
      state.permissions = initialState.permissions;
      state.roles = initialState.roles;
      state.communitySkills = initialState.communitySkills;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRelations.fulfilled, (state, action) => {
      state.relations = action.payload;
    });
    builder.addCase(getProgrammeTypes.fulfilled, (state, action) => {
      state.programmeTypes = action.payload;
    });
    builder.addCase(
      getProgrammeAttendanceReasons.fulfilled,
      (state, action) => {
        state.programmeAttendanceReason = action.payload;
      }
    );
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
    builder.addCase(
      getReasonsForPractitionerLeaving.fulfilled,
      (state, action) => {
        state.reasonForPractitionerLeaving = action.payload;
      }
    );
    builder.addCase(
      getReasonsForPractitionerLeavingProgramme.fulfilled,
      (state, action) => {
        state.reasonForPractitionerLeavingProgramme = action.payload;
      }
    );
    builder.addCase(getGrants.fulfilled, (state, action) => {
      state.grants = action.payload;
    });
    builder.addCase(getDocumentTypes.fulfilled, (state, action) => {
      state.documentTypes = action.payload;
    });
    builder.addCase(getWorkflowStatuses.fulfilled, (state, action) => {
      state.WorkflowStatuses = action.payload;
    });
    builder.addCase(getNoteTypes.fulfilled, (state, action) => {
      state.noteTypes = action.payload;
    });
    builder.addCase(getPermissions.fulfilled, (state, action) => {
      state.permissions = action.payload;
    });
    builder.addCase(getRoles.fulfilled, (state, action) => {
      state.roles = action.payload;
    });
    builder.addCase(getCommunitySkills.fulfilled, (state, action) => {
      state.communitySkills = action.payload;
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
