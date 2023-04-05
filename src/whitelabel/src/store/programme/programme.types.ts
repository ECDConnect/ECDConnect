import { DailyProgrammeDto, ProgrammeDto } from '@ecdlink/core';

export type ProgrammeState = {
  programmes?: ProgrammeDto[];
};

export type UpdateProgrammeDay = {
  programmeId: string;
  programmeDay: DailyProgrammeDto;
};

export type UpdateProgramme = {
  programme: ProgrammeDto;
};
