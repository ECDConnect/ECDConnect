import {
  DocumentTypeDto,
  EducationLevelDto,
  GenderDto,
  GrantDto,
  HolidayDto,
  LanguageDto,
  NoteTypeDto,
  PermissionDto,
  ProgrammeAttendanceReasonDto,
  ProgrammeTypeDto,
  ProvinceDto,
  RaceDto,
  ReasonForLeavingDto,
  ReasonForPractitionerLeavingDto,
  ReasonForPractitionerLeavingProgrammeDto,
  RelationDto,
  RoleSystemNameEnum,
  WorkflowStatusDto,
  RoleDto,
  ProfileSkillsDto,
} from '@ecdlink/core';
import { ProgrammeTypeEnum } from '@ecdlink/graphql';
import { createSelector } from 'reselect';
import { RootState } from '../types';

export const getProgrammeTypes = (state: RootState): ProgrammeTypeDto[] =>
  state.staticData.programmeTypes || [];

export const getPlaygroupProgrammeType = (
  state: RootState
): ProgrammeTypeDto => {
  const types = state.staticData.programmeTypes || [];
  const [PlayGroupType] = types.filter(
    (x) => x?.enumId === ProgrammeTypeEnum.Playgroup
  );
  return PlayGroupType;
};

export const getProgrammeAttendanceReasons = (
  state: RootState
): ProgrammeAttendanceReasonDto[] =>
  state.staticData.programmeAttendanceReason || [];

export const getGenders = (state: RootState): GenderDto[] =>
  state.staticData.gender || [];

export const getRaces = (state: RootState): RaceDto[] =>
  state.staticData.races || [];

export const getLanguages = (state: RootState): LanguageDto[] =>
  state.staticData.languages || [];

export const getRelations = (state: RootState): RelationDto[] => {
  const relations = !!state.staticData.relations
    ? [...state.staticData.relations]
    : [];

  const getOrder = (id: string) => {
    switch (id) {
      case '742bbf23-30b4-4eb8-9aed-08bd2d36fe81':
        return 1000; // Other
      default:
        return 0;
    }
  };

  relations.sort(function (a, b) {
    return getOrder(a.id!) - getOrder(b.id!);
  });

  return relations;
};

export const getEducationLevels = (state: RootState): EducationLevelDto[] => {
  const educationLevels = !!state.staticData.educationLevels
    ? [...state.staticData.educationLevels]
    : [];

  const getOrder = (id: string) => {
    switch (id) {
      case '9524e6be-b6ea-4b15-8200-9fee67d78935':
        return 1; // No matric
      case '2c09aaf9-f68e-45e7-871e-de0c2a6d27f2':
        return 2; // Matric
      case '42a1b3a3-bac6-03ce-0862-3243f81b0972':
        return 3; // Higher certificate
      case '68e7fb42-8db8-4798-8853-0fa9cc602981':
        return 4; // Diploma
      case 'e015e4e7-cab2-43f6-bbb8-3ea1100e3051':
        return 5; // Bachelors
      case '3b60119a-fadf-71e3-3ab0-1076bf48e954':
        return 6; // Masters
      case '0a946619-5a69-b3f6-b82e-907c647cacfe':
        return 7; // Doctorate
      default:
        return 1000;
    }
  };

  educationLevels.sort(function (a, b) {
    return getOrder(a.id!) - getOrder(b.id!);
  });

  return educationLevels;
};

export const getProvinces = (state: RootState): ProvinceDto[] =>
  state.staticData.provinces || [];

export const getHolidays = (state: RootState): HolidayDto[] =>
  state.staticData.holidays || [];

export const getReasonsForLeaving = (
  state: RootState
): ReasonForLeavingDto[] | undefined => state.staticData.reasonForLeaving;

export const getReasonsForPractitionerLeaving = (
  state: RootState
): ReasonForPractitionerLeavingDto[] | undefined =>
  state.staticData.reasonForPractitionerLeaving;

export const getReasonsForPractitionerLeavingProgramme = (
  state: RootState
): ReasonForPractitionerLeavingProgrammeDto[] | undefined =>
  state.staticData.reasonForPractitionerLeavingProgramme;

export const getGrants = (state: RootState): GrantDto[] =>
  state.staticData.grants || [];

export const getRelationById = (relationId?: string) =>
  createSelector(
    (state: RootState) => state.staticData.relations || [],
    (relations: RelationDto[]) => {
      if (!relations || !relationId) return undefined;

      //TD: test t-eq
      return relations.find((relation) => relation.id === relationId);
    }
  );

export const getDocumentTypes = (state: RootState): DocumentTypeDto[] =>
  state.staticData.documentTypes || [];

export const getWorkflowStatuses = (state: RootState): WorkflowStatusDto[] =>
  state.staticData.WorkflowStatuses || [];

export const getNoteTypes = (state: RootState): NoteTypeDto[] =>
  state.staticData.noteTypes || [];

export const getPermissions = (state: RootState): PermissionDto[] =>
  state.staticData.permissions || [];

export const geCoachRole = (state: RootState): RoleDto => {
  const roles = state.staticData.roles || [];
  const [coachRole] = roles.filter(
    (x) => x?.systemName === RoleSystemNameEnum.Coach
  );
  return coachRole;
};

export const getCommunitySkills = (state: RootState): ProfileSkillsDto[] =>
  state.staticData.communitySkills || [];
