import { EntityBase } from '../entity-base';

export interface ProgrammeDto extends EntityBase {
  classroomId: string;
  name: string;
  startDate: string;
  endDate: string;
  preferredLanguage: string;
  dailyProgrammes: DailyProgrammeDto[];
  classroomGroupId?: string;
}

export interface DailyProgrammeDto extends EntityBase {
  programmeId: string;
  day: string;
  dayDate: string;
  messageBoardText: string;
  smallGroupActivityId?: number;
  largeGroupActivityId?: number;
  storyBookId?: number;
  storyActivityId?: number;
}
