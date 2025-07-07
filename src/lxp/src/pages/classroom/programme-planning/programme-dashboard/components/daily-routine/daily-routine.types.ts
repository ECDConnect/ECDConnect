import { DailyProgrammeDto, ProgrammeDto } from '@ecdlink/core';

export interface DailyRoutineProps {
  programme?: ProgrammeDto;
  currentDailyProgramme?: DailyProgrammeDto;
  setSelectedDate?: any;
  selectedDate?: Date;
  isHoliday?: boolean;
}
