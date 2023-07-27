import {
  DocumentTypeDto,
  EducationLevelDto,
  GenderDto,
  GrantDto,
  HolidayDto,
  LanguageDto,
  NoteTypeDto,
  ProgrammeAttendanceReasonDto,
  ProgrammeTypeDto,
  ProvinceDto,
  RaceDto,
  ReasonForLeavingDto,
  ReasonForPractitionerLeavingDto,
  ReasonForPractitionerLeavingProgrammeDto,
  RelationDto,
  WorkflowStatusDto,
} from '@ecdlink/core';
import { ProgrammeTypeEnum } from '@ecdlink/graphql';
import { createSelector } from 'reselect';
import { RootState } from '../types';

export const getRelations = (state: RootState): RelationDto[] =>
  state.staticData.relations || [];

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

export const getEducationLevels = (state: RootState): EducationLevelDto[] =>
  state.staticData.educationLevels || [];

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
