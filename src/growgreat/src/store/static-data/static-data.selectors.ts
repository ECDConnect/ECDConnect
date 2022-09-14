import {
  DocumentTypeDto,
  EducationLevelDto,
  GenderDto,
  HolidayDto,
  LanguageDto,
  NoteTypeDto,
  ProvinceDto,
  RaceDto,
  ReasonForLeavingDto,
  RelationDto,
  WorkflowStatusDto,
} from '@ecdlink/core';
import { createSelector } from 'reselect';
import { RootState } from '../types';

export const getRelations = (state: RootState): RelationDto[] =>
  state.staticData.relations || [];

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
