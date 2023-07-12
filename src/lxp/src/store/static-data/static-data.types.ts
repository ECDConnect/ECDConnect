import {
  EducationLevelDto,
  GenderDto,
  GrantDto,
  HolidayDto,
  LanguageDto,
  ProgrammeAttendanceReasonDto,
  ProgrammeTypeDto,
  ProvinceDto,
  RaceDto,
  RelationDto,
  ReasonForLeavingDto,
  ReasonForLeavingPractitionerDto,
  DocumentTypeDto,
  WorkflowStatusDto,
  NoteTypeDto,
} from '@ecdlink/core';

export type StaticDataState = {
  relations: RelationDto[] | undefined;
  programmeTypes: ProgrammeTypeDto[] | undefined;
  programmeAttendanceReason: ProgrammeAttendanceReasonDto[] | undefined;
  gender: GenderDto[] | undefined;
  languages: LanguageDto[] | undefined;
  races: RaceDto[] | undefined;
  educationLevels: EducationLevelDto[] | undefined;
  provinces: ProvinceDto[] | undefined;
  holidays: HolidayDto[] | undefined;
  reasonForLeaving: ReasonForLeavingDto[] | undefined;
  reasonForLeavingPractitioner: ReasonForLeavingPractitionerDto[] | undefined;
  grants: GrantDto[] | undefined;
  documentTypes: DocumentTypeDto[] | undefined;
  WorkflowStatuses: WorkflowStatusDto[] | undefined;
  noteTypes: NoteTypeDto[] | undefined;
};
