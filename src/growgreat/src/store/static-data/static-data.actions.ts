import {
  EducationLevelDto,
  GenderDto,
  HolidayDto,
  LanguageDto,
  ReasonForLeavingDto,
  ProvinceDto,
  RaceDto,
  RelationDto,
  DocumentTypeDto,
  WorkflowStatusDto,
  NoteTypeDto,
} from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { DocumentTypeService } from '@services/DocumentTypeService';
import { EducationLevelService } from '@services/EducationLevelService';
import { GenderService } from '@services/GenderService';
import { HolidayService } from '@services/HolidayService';
import { LanguageService } from '@services/LanguageService';
import { NoteTypeService } from '@services/NoteTypeService';
import { ProvinceService } from '@services/ProvinceService';
import { RaceService } from '@services/RaceService';
import { ReasonForLeavingService } from '@services/ReasonForLeavingService';
import { RelationsService } from '@services/RelationsService';
import { WorkflowStatusService } from '@services/WorkflowStatusService';
import { RootState, ThunkApiType } from '../types';

export const getRelations = createAsyncThunk<
  RelationDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>('getRelations', async (_, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
    staticData: { relations: relationsCache },
  } = getState();

  if (!relationsCache) {
    try {
      let relations: RelationDto[] | undefined;

      if (userAuth?.auth_token) {
        relations = await new RelationsService(
          userAuth?.auth_token
        ).getRelations();
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!relations) {
        return rejectWithValue('Error getting Relations');
      }

      return relations;
    } catch (err) {
      return rejectWithValue(err);
    }
  } else {
    return relationsCache;
  }
});

export const getGenders = createAsyncThunk<
  GenderDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>('getGenders', async (_, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
    staticData: { gender: genderCache },
  } = getState();

  if (!genderCache) {
    try {
      let gender: GenderDto[] | undefined;

      if (userAuth?.auth_token) {
        gender = await new GenderService(userAuth?.auth_token).getGenders();
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!gender) {
        return rejectWithValue('Error getting Genders');
      }

      return gender;
    } catch (err) {
      return rejectWithValue(err);
    }
  } else {
    return genderCache;
  }
});

export const getRaces = createAsyncThunk<
  RaceDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>('getRaces', async (_, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
    staticData: { races: raceCache },
  } = getState();

  if (!raceCache) {
    try {
      let races: RaceDto[] | undefined;

      if (userAuth?.auth_token) {
        races = await new RaceService(userAuth?.auth_token).getRaces();
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!races) {
        return rejectWithValue('Error getting Races');
      }

      return races;
    } catch (err) {
      return rejectWithValue(err);
    }
  } else {
    return raceCache;
  }
});

export const getLanguages = createAsyncThunk<
  LanguageDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>('getLanguages', async (_, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
    staticData: { languages: languagesCache },
  } = getState();

  if (!languagesCache) {
    try {
      let languages: LanguageDto[] | undefined;
      if (userAuth?.auth_token) {
        languages = await new LanguageService(
          userAuth?.auth_token
        ).getLanguages();
      }

      if (!languages) {
        return rejectWithValue('Error Languages');
      }

      return languages;
    } catch (err) {
      return rejectWithValue(err);
    }
  } else {
    return languagesCache;
  }
});

export const getProvinces = createAsyncThunk<
  ProvinceDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>('getProvinces', async (_, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
    staticData: { provinces: provincesCache },
  } = getState();

  if (!provincesCache) {
    try {
      let provinces: ProvinceDto[] | undefined;

      if (userAuth?.auth_token) {
        provinces = await new ProvinceService(
          userAuth?.auth_token
        ).getProvinces();
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!provinces) {
        return rejectWithValue('Error getting Provinces');
      }

      return provinces;
    } catch (err) {
      return rejectWithValue(err);
    }
  } else {
    return provincesCache;
  }
});

export const getEducationLevels = createAsyncThunk<
  EducationLevelDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>('getEducationLevels', async (_, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
    staticData: { educationLevels: educationLevelsCache },
  } = getState();

  if (!educationLevelsCache) {
    try {
      let educationLevels: EducationLevelDto[] | undefined;

      if (userAuth?.auth_token) {
        educationLevels = await new EducationLevelService(
          userAuth?.auth_token
        ).getEducationLevels();
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!educationLevels) {
        return rejectWithValue('Error getting Education Levels');
      }

      return educationLevels;
    } catch (err) {
      return rejectWithValue(err);
    }
  } else {
    return educationLevelsCache;
  }
});

export const getHolidays = createAsyncThunk<
  HolidayDto[],
  { year: number },
  ThunkApiType<RootState>
>('getHolidays', async ({ year }, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
    staticData: { holidays: holidaysCache },
  } = getState();

  if (!holidaysCache) {
    try {
      let holidays: HolidayDto[] | undefined;

      if (userAuth?.auth_token) {
        holidays = await new HolidayService(
          userAuth?.auth_token
        ).getHolidaysByYear(year);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!holidays) {
        return rejectWithValue('Error getting Holidays');
      }

      return holidays;
    } catch (err) {
      return rejectWithValue(err);
    }
  } else {
    return holidaysCache;
  }
});

export const getReasonsForLeaving = createAsyncThunk<
  ReasonForLeavingDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>('getReasonsForLeaving', async (_, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
    staticData: { reasonForLeaving },
  } = getState();

  if (!reasonForLeaving) {
    try {
      let reasons: ReasonForLeavingDto[] | undefined;

      if (userAuth?.auth_token) {
        reasons = await new ReasonForLeavingService(
          userAuth?.auth_token
        ).getReasonsForLeaving();
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!reasons) {
        return rejectWithValue('Error getting Reasons For Leaving');
      }

      return reasons;
    } catch (err) {
      return rejectWithValue(err);
    }
  } else {
    return reasonForLeaving;
  }
});

export const getDocumentTypes = createAsyncThunk<
  DocumentTypeDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>('getDocumentTypes', async (_, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
    staticData: { documentTypes: documentTypesCache },
  } = getState();

  if (documentTypesCache) return documentTypesCache;

  try {
    if (!userAuth?.auth_token)
      return rejectWithValue('no access token, profile check required');

    const documentTypes: DocumentTypeDto[] = await new DocumentTypeService(
      userAuth?.auth_token
    ).getDocumentTypes();

    if (!documentTypes) {
      return rejectWithValue('Error getting Document Types');
    }

    return documentTypes;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const getWorkflowStatuses = createAsyncThunk<
  WorkflowStatusDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>('getWorkflowStatuses', async (_, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
    staticData: { WorkflowStatuses: WorkflowStatusesCache },
  } = getState();

  if (WorkflowStatusesCache) return WorkflowStatusesCache;

  try {
    if (!userAuth?.auth_token)
      return rejectWithValue('no access token, profile check required');

    const statuses: WorkflowStatusDto[] = await new WorkflowStatusService(
      userAuth?.auth_token
    ).getWorkflowStatuses();

    if (!statuses) {
      return rejectWithValue('Error getting Workflow Statuses');
    }

    return statuses;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const getNoteTypes = createAsyncThunk<
  NoteTypeDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>('getNoteTypes', async (_, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
    staticData: { noteTypes: noteTypesCache },
  } = getState();

  if (noteTypesCache) return noteTypesCache;

  try {
    if (!userAuth?.auth_token)
      return rejectWithValue('no access token, profile check required');

    const types: NoteTypeDto[] = await new NoteTypeService(
      userAuth?.auth_token
    ).getNoteTypes();

    if (!types) {
      return rejectWithValue('Error getting note types');
    }

    return types;
  } catch (err) {
    return rejectWithValue(err);
  }
});
