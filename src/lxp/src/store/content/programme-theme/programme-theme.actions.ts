import { ProgrammeThemeDto } from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ContentProgrammeThemeService } from '@services/ContentProgrammeThemeService';
import { RootState, ThunkApiType } from '../../types';

export const ProgrammeThemeActions = {
  GET_PROGRAMME_THEMES: 'getProgrammeThemes',
};

export const getProgrammeThemes = createAsyncThunk<
  ProgrammeThemeDto[],
  { locale: string },
  ThunkApiType<RootState>
>(
  ProgrammeThemeActions.GET_PROGRAMME_THEMES,
  async ({ locale }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      programmeThemeData: { programmeThemes: programmeThemeCache },
    } = getState();

    if (!programmeThemeCache) {
      try {
        let programmeThemes: ProgrammeThemeDto[] | undefined;

        if (userAuth?.auth_token) {
          programmeThemes = await new ContentProgrammeThemeService(
            userAuth?.auth_token
          ).getProgrammeThemes(locale);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!programmeThemes) {
          return rejectWithValue('Error getting programme themes');
        }

        return programmeThemes;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return programmeThemeCache;
    }
  }
);
