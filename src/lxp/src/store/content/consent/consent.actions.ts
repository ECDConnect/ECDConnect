import { ConsentDto, ContentConsentTypeEnum } from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ContentConsentService } from '@services/ContentConsentService';
import { RootState, ThunkApiType } from '../../types';

export const getConsent = createAsyncThunk<
  ConsentDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  { locale: string; authToken?: string },
  ThunkApiType<RootState>
>(
  'getConsent',
  // eslint-disable-next-line no-empty-pattern
  async ({ locale, authToken }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      contentConsentData: { consent: consentCache },
    } = getState();

    if (!consentCache) {
      try {
        let content: ConsentDto[] = [];

        if (userAuth?.auth_token || authToken) {
          content = await new ContentConsentService(
            locale,
            userAuth && userAuth?.auth_token
              ? userAuth?.auth_token
              : authToken ?? ''
          ).getConsent();
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!content) {
          return rejectWithValue('Error getting Terms And Conditions');
        }

        return content;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return consentCache;
    }
  }
);

export const getOpenConsent = createAsyncThunk<
  ConsentDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  { locale: string; name: ContentConsentTypeEnum },
  ThunkApiType<RootState>
>(
  'getOpenConsent',
  // eslint-disable-next-line no-empty-pattern
  async ({ locale, name }, { rejectWithValue }) => {
    try {
      let content = await new ContentConsentService(
        locale,
        name
      ).getOpenConsent(name);

      if (!content) {
        return rejectWithValue('Error getting Terms And Conditions');
      }

      return content;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
