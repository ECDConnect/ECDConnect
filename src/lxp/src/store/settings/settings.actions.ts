import { SettingTypeDto } from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { SettingsService } from '@services/SettingsService';
import { RootState, ThunkApiType } from '../types';

export const getSettings = createAsyncThunk<
  SettingTypeDto,
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getSettings',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      settings: { settings: settingsCache },
    } = getState();

    if (!settingsCache) {
      try {
        let settings: SettingTypeDto | undefined;

        if (userAuth?.auth_token) {
          settings = await new SettingsService(
            userAuth?.auth_token
          ).getSettingType();
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!settings) {
          return rejectWithValue('Error getting Settings');
        }

        return settings;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return settingsCache;
    }
  }
);
