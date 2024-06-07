import { EntityBase } from '../entity-base';

export interface ClassProgrammeDto extends EntityBase {
  classroomGroupId: string;
  programmeStartDate: string;
  meetingDay: number;
  isFullDay: boolean;
  isActive: boolean;
}
