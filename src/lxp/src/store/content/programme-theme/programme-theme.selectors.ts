import { ProgrammeThemeDto } from '@ecdlink/core';
import { RootState } from '../../types';

export const getProgrammeThemes = (state: RootState): ProgrammeThemeDto[] =>
  state.programmeThemeData.programmeThemes || [];
