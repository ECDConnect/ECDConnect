import {
  EducationLevelDto,
  GenderDto,
  HolidayDto,
  LanguageDto,
  ProvinceDto,
  RaceDto,
  RelationDto,
  ReasonForLeavingDto,
  DocumentTypeDto,
  WorkflowStatusDto,
  NoteTypeDto,
  PermissionDto,
} from '@ecdlink/core';

export type StaticDataState = {
  relations: RelationDto[] | undefined;
  gender: GenderDto[] | undefined;
  languages: LanguageDto[] | undefined;
  races: RaceDto[] | undefined;
  educationLevels: EducationLevelDto[] | undefined;
  provinces: ProvinceDto[] | undefined;
  holidays: HolidayDto[] | undefined;
  reasonForLeaving: ReasonForLeavingDto[] | undefined;
  documentTypes: DocumentTypeDto[] | undefined;
  WorkflowStatuses: WorkflowStatusDto[] | undefined;
  noteTypes: NoteTypeDto[] | undefined;
  permissions: PermissionDto[] | undefined;
};
