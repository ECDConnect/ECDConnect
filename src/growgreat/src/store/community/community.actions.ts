import { CommunitySectionGg, CommunitySectionItemGg } from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { CommunityService } from '@/services/CommunityService';

export interface CommunityConnectDataForGGWithLocale {
  locale: string;
}

export const CommunityActions = {
  GET_ALL_COMMUNITY_CONNECT_DATA_FOR_GG: 'GetAllCommunitySectionGG',
  GET_ALL_COMMUNITY_SECTION_ITEM_GG: 'GetAllCommunitySectionItemGG',
};

export const getCommunitySectionGG = createAsyncThunk<
  CommunitySectionGg[],
  { locale: string },
  ThunkApiType<RootState>
>(
  CommunityActions.GET_ALL_COMMUNITY_CONNECT_DATA_FOR_GG,
  async ({ locale }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let content: CommunitySectionGg[] | undefined = undefined;

      if (userAuth?.auth_token) {
        content = await new CommunityService(
          userAuth?.auth_token ?? ''
        ).GetAllCommunitySectionGG(locale);
        return content;
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAllCommunitySectionItemGG = createAsyncThunk<
  CommunitySectionItemGg[],
  { locale: string },
  ThunkApiType<RootState>
>(
  CommunityActions.GET_ALL_COMMUNITY_SECTION_ITEM_GG,
  async ({ locale }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let content: CommunitySectionItemGg[] | undefined = undefined;

      if (userAuth?.auth_token) {
        content = await new CommunityService(
          userAuth?.auth_token ?? ''
        ).GetAllCommunitySectionItemGG(locale);

        return content;
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
