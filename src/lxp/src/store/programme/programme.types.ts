import { OfflineUpdate } from '@/models/sync/offline-update';
import { DailyProgrammeDto, ProgrammeDto } from '@ecdlink/core';

export type ProgrammeState = {
  programmes?: (ProgrammeDto & Partial<OfflineUpdate>)[];
};

export type UpdateProgrammeDay = {
  programmeId: string;
  programmeDay: DailyProgrammeDto;
};

export type UpdateProgramme = {
  programme: ProgrammeDto;
};
