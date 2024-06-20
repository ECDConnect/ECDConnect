import { ProgrammeDto, ProgrammeThemeDto } from '@ecdlink/core';

export interface ProgrammeTimingRouteState {
  classroomGroupId: string;
  theme: ProgrammeThemeDto;
  programmeToEdit?: ProgrammeDto;
}
