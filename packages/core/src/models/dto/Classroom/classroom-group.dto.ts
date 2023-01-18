import { EntityBase } from '../entity-base';
import { ClassProgrammeDto } from './class-programme.dto';
import { ClassroomDto } from './classroom.dto';
import { LearnerDto } from './learner.dto';
import { ProgrammeTypeDto } from './programme-type.dto';

export interface ClassroomGroupDto extends EntityBase {
  classroomId: string;
  practitionerId?: string;
  classroom?: ClassroomDto;
  programmeType?: ProgrammeTypeDto;
  programmeTypeId?: string;
  learners?: LearnerDto[];
  classProgrammes?: ClassProgrammeDto[];
  name: string;
  userId?: string;
}
