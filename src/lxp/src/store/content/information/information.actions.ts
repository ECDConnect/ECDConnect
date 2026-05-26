import { createAsyncThunk } from '@reduxjs/toolkit';
import InfoService from '@/services/InfoService/InfoService';
import { RootState, ThunkApiType } from '../../types';
import { OverrideCache } from '@/models/sync/override-cache';
import { MoreInformation } from '@ecdlink/graphql';

export const InformationActions = {
  GET_MORE_INFORMATION: 'getMoreInformation',
};

export const getMoreInformation = createAsyncThunk<
  MoreInformation[],
  { section: string; locale: string } & OverrideCache,
  ThunkApiType<RootState>
>(
  InformationActions.GET_MORE_INFORMATION,
  async (
    { section, locale, overrideCache = false },
    { getState, rejectWithValue }
  ) => {
    const state = getState();

    const currentInfo = state.informationData?.information;

    // Check cache for exact section + locale match
    if (!overrideCache && currentInfo) {
      if (
        currentInfo.section === section &&
        currentInfo.locale === locale &&
        currentInfo.data?.length > 0
      ) {
        // Return cached data (this will go to fulfilled with the array)
        return currentInfo.data;
      }
    }

    // Force fresh fetch if overrideCache is true OR no valid cache
    try {
      if (!state.auth?.userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      const activities = await new InfoService().getMoreInformation(
        section,
        locale
      );

      if (!activities) {
        return rejectWithValue('Error getting more information');
      }

      return activities; // This will be stored in .data by the reducer
    } catch (err: any) {
      return rejectWithValue(err?.message ?? err ?? 'Unknown error');
    }
  }
);
