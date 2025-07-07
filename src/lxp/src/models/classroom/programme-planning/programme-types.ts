import { DailyProgrammeDto } from '@ecdlink/core';

export type ProgrammeWeek = {
  startDate: number | Date;
  endDate: number | Date;
  weekNumber: number;
  totalIncompleteDays: number;
  days: DailyProgrammeDto[];
};
