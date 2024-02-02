import { EntityBase } from '../entity-base';

export interface AbsenteeDto extends EntityBase {
  absentDate?: string | Date;
  absentDateEnd?: string | Date;
  className?: string;
  classroomGroupId?: string;
  reason?: string;
  reassignedToPerson?: string;
  reassignedToUserId?: string;
  absenteeId?: string;
  loggedByPerson?: string;
  loggedByUserId?: string;
}
