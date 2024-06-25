import { EntityBase } from '../entity-base';
import { ClassroomGroupDto } from './classroom-group.dto';

export interface ClassProgrammeDto extends EntityBase {
  classroomGroupId: string;
  classroomGroup?: ClassroomGroupDto;
  programmeStartDate: string;
  meetingDay: number;
  isFullDay: boolean;
  isActive: boolean;
}
