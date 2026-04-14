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
  ReasonForPractitionerLeavingDto,
  DocumentTypeDto,
  WorkflowStatusDto,
  NoteTypeDto,
  ReasonForPractitionerLeavingProgrammeDto,
  PermissionDto,
  RoleDto,
  ProfileSkillsDto,
} from '@ecdlink/core';
import { MoreInformation } from '@ecdlink/graphql/lib/graphql/generatedGraphql';
import { ThunkStateStatus } from '../types';

export type StaticDataState = ThunkStateStatus & {
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
  reasonForPractitionerLeaving: ReasonForPractitionerLeavingDto[] | undefined;
  reasonForPractitionerLeavingProgramme:
    | ReasonForPractitionerLeavingProgrammeDto[]
    | undefined;
  grants: GrantDto[] | undefined;
  documentTypes: DocumentTypeDto[] | undefined;
  WorkflowStatuses: WorkflowStatusDto[] | undefined;
  noteTypes: NoteTypeDto[] | undefined;
  permissions: PermissionDto[] | undefined;
  roles: RoleDto[] | undefined;
  communitySkills: ProfileSkillsDto[] | undefined;
  moreInformation: Record<string, MoreInformation[]>;
};
