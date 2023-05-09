import { CommunitySectionItemSs, CommunitySectionSs } from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { CommunityService } from '@/services/CommunityService';

export interface CommunityConnectDataForGGWithLocale {
  locale: string;
}

export const CommunityActions = {
  GET_ALL_COMMUNITY_CONNECT_DATA_FOR_SS: 'GetAllCommunitySectionSS',
  GET_ALL_COMMUNITY_SECTION_ITEM_SS: 'GetAllCommunitySectionItemSS',
};

export const getCommunitySectionSS = createAsyncThunk<
  CommunitySectionSs[],
  { locale: string },
  ThunkApiType<RootState>
>(
  CommunityActions.GET_ALL_COMMUNITY_CONNECT_DATA_FOR_SS,
  async ({ locale }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let content: CommunitySectionSs[] | undefined = undefined;

      if (userAuth?.auth_token) {
        content = await new CommunityService(
          userAuth?.auth_token ?? ''
        ).GetAllCommunitySectionSS(locale);
        return content;
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAllCommunitySectionItemSS = createAsyncThunk<
  CommunitySectionItemSs[],
  { locale: string },
  ThunkApiType<RootState>
>(
  CommunityActions.GET_ALL_COMMUNITY_SECTION_ITEM_SS,
  async ({ locale }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let content: CommunitySectionItemSs[] | undefined = undefined;

      if (userAuth?.auth_token) {
        content = await new CommunityService(
          userAuth?.auth_token ?? ''
        ).GetAllCommunitySectionItemSS(locale);

        return content;
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
