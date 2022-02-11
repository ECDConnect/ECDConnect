import { EntityBase } from '../entity-base';
import { ClassroomGroupDto } from './classroom-group.dto';

export interface ClassProgrammeDto extends EntityBase {
  classroomGroup?: ClassroomGroupDto;
  classroomGroupId: string;
  programmeStartDate: string;
  meetingDay: number;
  isFullDay: boolean;
}
