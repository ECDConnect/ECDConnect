import { EntityBase } from '../entity-base';

export interface ClassProgrammeDto extends EntityBase {
  classroomGroupId: string;
  classroomGroup?: ClassroomGroupDto;
  programmeStartDate: string;
  meetingDay: number;
  isFullDay: boolean;
  isActive: boolean;
}
