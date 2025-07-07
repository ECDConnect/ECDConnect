import { ProgrammeDto, ProgrammeThemeDto } from '@ecdlink/core';
import { ProgrammeThemeRouteState } from '../programme-theme/programme-theme.types';

export interface ProgrammeTimingRouteState {
  classroomGroupId: string;
  theme: ProgrammeThemeDto;
  programmeToEdit?: ProgrammeDto;
  initialDate?: ProgrammeThemeRouteState['initialDate'];
}
