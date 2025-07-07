import {
  EducationLevelDto,
  GenderDto,
  GrantDto,
  HolidayDto,
  LanguageDto,
  ProgrammeAttendanceReasonDto,
  ProgrammeTypeDto,
  ReasonForLeavingDto,
  ReasonForPractitionerLeavingDto,
  ProvinceDto,
  RaceDto,
  RelationDto,
  DocumentTypeDto,
  WorkflowStatusDto,
  NoteTypeDto,
  ReasonForPractitionerLeavingProgrammeDto,
  PermissionDto,
  RoleDto,
  ProfileSkillsDto,
} from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { DocumentTypeService } from '@services/DocumentTypeService';
import { EducationLevelService } from '@services/EducationLevelService';
import { GenderService } from '@services/GenderService';
import GrantService from '@services/GrantService/GrantService';
import { HolidayService } from '@services/HolidayService';
import { LanguageService } from '@services/LanguageService';
import { NoteTypeService } from '@services/NoteTypeService';
import { ProgrammeAttendanceReasonService } from '@services/ProgrammeAttendanceReasonService';
import { ProgrammeTypeService } from '@services/ProgrammeTypeService';
import { ProvinceService } from '@services/ProvinceService';
import { RaceService } from '@services/RaceService';
import { ReasonForLeavingService } from '@services/ReasonForLeavingService';
import { ReasonForPractitionerLeavingService } from '@services/ReasonForPractitionerLeavingService';
import { RelationsService } from '@services/RelationsService';
import { WorkflowStatusService } from '@services/WorkflowStatusService';
import { RootState, ThunkApiType } from '../types';
import { ReasonForPractitionerLeavingProgrammeService } from '@/services/ReasonForPractitionerLeavingProgrammeService';
import PermissionsService from '@/services/PermissionsService/PermissionsService';
import { RoleService } from '@/services/RoleService';
import { SkillsService } from '@/services/SkillsService';

export const getRelations = createAsyncThunk<
  RelationDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getRelations',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
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
  }
);

export const getProgrammeTypes = createAsyncThunk<
  ProgrammeTypeDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getProgrammeTypes',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      staticData: { programmeTypes: programmeTypeCache },
    } = getState();

    if (!programmeTypeCache) {
      try {
        let programmeTypes: ProgrammeTypeDto[] | undefined;

        if (userAuth?.auth_token) {
          programmeTypes = await new ProgrammeTypeService(
            userAuth?.auth_token
          ).getProgrammeTypes();
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!programmeTypes) {
          return rejectWithValue('Error getting Programme Types');
        }

        return programmeTypes;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return programmeTypeCache;
    }
  }
);

export const getProgrammeAttendanceReasons = createAsyncThunk<
  ProgrammeAttendanceReasonDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getProgrammeAttendanceReasons',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      staticData: { programmeAttendanceReason: programmeAttendanceReasonCache },
    } = getState();

    if (!programmeAttendanceReasonCache) {
      try {
        let programmeAttendanceReason:
          | ProgrammeAttendanceReasonDto[]
          | undefined;

        if (userAuth?.auth_token) {
          programmeAttendanceReason =
            await new ProgrammeAttendanceReasonService(
              userAuth?.auth_token
            ).getProgrammeAttendanceReasons();
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!programmeAttendanceReason) {
          return rejectWithValue('Error getting Programme Attendance Reasons');
        }

        return programmeAttendanceReason;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return programmeAttendanceReasonCache;
    }
  }
);

export const getGenders = createAsyncThunk<
  GenderDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getGenders',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
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
  }
);

export const getRaces = createAsyncThunk<
  RaceDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getRaces',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
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
  }
);

export const getLanguages = createAsyncThunk<
  LanguageDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getLanguages',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
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
  }
);

export const getOpenLanguages = createAsyncThunk<
  LanguageDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>('getLanguages', async (_, { getState, rejectWithValue }) => {
  const {
    staticData: { languages: languagesCache },
  } = getState();

  if (!languagesCache) {
    try {
      let languages: LanguageDto[] | undefined;
      languages = await new LanguageService('').getOpenLanguages();

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
>(
  'getProvinces',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
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
  }
);

export const getEducationLevels = createAsyncThunk<
  EducationLevelDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getEducationLevels',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
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
  }
);

export const getHolidays = createAsyncThunk<
  HolidayDto[],
  { year: number },
  ThunkApiType<RootState>
>(
  'getHolidays',
  // eslint-disable-next-line no-empty-pattern
  async ({ year }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      staticData: { holidays: holidaysCache },
    } = getState();

    let getNewHolidays = false;
    if (holidaysCache) {
      if (year !== new Date(holidaysCache[0].day).getFullYear()) {
        getNewHolidays = !getNewHolidays;
      }
    }

    if (!holidaysCache || getNewHolidays) {
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
  }
);

export const getReasonsForLeaving = createAsyncThunk<
  ReasonForLeavingDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getReasonsForLeaving',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
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
  }
);

export const getReasonsForPractitionerLeaving = createAsyncThunk<
  ReasonForPractitionerLeavingDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getReasonsForPractitionerLeaving',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      staticData: { reasonForPractitionerLeaving },
    } = getState();

    if (!reasonForPractitionerLeaving) {
      try {
        let reasons: ReasonForPractitionerLeavingDto[] | undefined;

        if (userAuth?.auth_token) {
          reasons = await new ReasonForPractitionerLeavingService(
            userAuth?.auth_token
          ).getReasonsForPractitionerLeaving();
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!reasons) {
          return rejectWithValue(
            'Error getting Reasons For Leaving practitioner'
          );
        }

        return reasons;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return reasonForPractitionerLeaving;
    }
  }
);

export const getReasonsForPractitionerLeavingProgramme = createAsyncThunk<
  ReasonForPractitionerLeavingProgrammeDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getReasonsForPractitionerLeavingProgramme',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      staticData: { reasonForPractitionerLeavingProgramme },
    } = getState();

    if (!reasonForPractitionerLeavingProgramme) {
      try {
        let reasons: ReasonForPractitionerLeavingDto[] | undefined;

        if (userAuth?.auth_token) {
          reasons = await new ReasonForPractitionerLeavingProgrammeService(
            userAuth?.auth_token
          ).getReasonsForPractitionerLeavingProgramme();
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!reasons) {
          return rejectWithValue(
            'Error getting Reasons For practitioner Leaving programme'
          );
        }

        return reasons;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return reasonForPractitionerLeavingProgramme;
    }
  }
);

export const getGrants = createAsyncThunk<
  GrantDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getGrants',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      staticData: { grants: grantsCache },
    } = getState();

    if (grantsCache) return grantsCache;

    try {
      if (!userAuth?.auth_token)
        return rejectWithValue('no access token, profile check required');

      const grants: GrantDto[] = await new GrantService(
        userAuth?.auth_token
      ).getGrants();

      if (!grants) {
        return rejectWithValue('Error getting grants');
      }

      return grants;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getDocumentTypes = createAsyncThunk<
  DocumentTypeDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getDocumentTypes',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
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
  }
);

export const getWorkflowStatuses = createAsyncThunk<
  WorkflowStatusDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getWorkflowStatuses',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
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
  }
);

export const getNoteTypes = createAsyncThunk<
  NoteTypeDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getNoteTypes',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
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
  }
);

export const getPermissions = createAsyncThunk<
  PermissionDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>('getPermissions', async (_, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
    staticData: { permissions: permissionsCache },
  } = getState();

  if (!permissionsCache) {
    try {
      let permissions: PermissionDto[] | undefined;
      if (userAuth?.auth_token) {
        permissions = await new PermissionsService(
          userAuth?.auth_token
        ).getPermissions();
      }

      if (!permissions) {
        return rejectWithValue('Error permissions');
      }

      return permissions;
    } catch (err) {
      return rejectWithValue(err);
    }
  } else {
    return permissionsCache;
  }
});

export const getRoles = createAsyncThunk<
  RoleDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>('getRoles', async (_, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
    staticData: { roles: rolesCache },
  } = getState();

  if (!rolesCache) {
    try {
      let roles: RoleDto[] | undefined;
      if (userAuth?.auth_token) {
        roles = await new RoleService(userAuth?.auth_token).getRoles();
      }

      if (!roles) {
        return rejectWithValue('Error permissions');
      }

      return roles;
    } catch (err) {
      return rejectWithValue(err);
    }
  } else {
    return rolesCache;
  }
});

export const getCommunitySkills = createAsyncThunk<
  ProfileSkillsDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>('getCommunitySkills', async (_, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
    staticData: { communitySkills: communitySkillsCache },
  } = getState();

  if (!communitySkillsCache) {
    try {
      let communitySkills: ProfileSkillsDto[] | undefined;
      if (userAuth?.auth_token) {
        communitySkills = await new SkillsService(
          userAuth?.auth_token
        ).getCommunitySkills();
      }

      if (!communitySkills) {
        return rejectWithValue('Error communitySkills');
      }

      return communitySkills;
    } catch (err) {
      return rejectWithValue(err);
    }
  } else {
    return communitySkillsCache;
  }
});
