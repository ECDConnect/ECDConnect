import { CommunityProfile, Connect, ConnectItem } from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { CommunityService } from '@/services/CommunityService';

export interface CommunityConnectDataForGGWithLocale {
  locale: string;
}

export const CommunityActions = {
  GET_ALL_CONNECT: 'getAllConnect',
  GET_ALL_CONNECT_ITEM: 'getAllConnectItem',
  GET_COMMUNITY_PROFILE: 'getCommunityProfile',
};

export const getAllConnect = createAsyncThunk<
  Connect[],
  { locale: string },
  ThunkApiType<RootState>
>(
  CommunityActions.GET_ALL_CONNECT,
  async ({ locale }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let content: Connect[] | undefined = undefined;

      if (userAuth?.auth_token) {
        content = await new CommunityService(
          userAuth?.auth_token ?? ''
        ).getAllConnect(locale);
        return content;
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAllConnectItem = createAsyncThunk<
  ConnectItem[],
  { locale: string },
  ThunkApiType<RootState>
>(
  CommunityActions.GET_ALL_CONNECT_ITEM,
  async ({ locale }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let content: ConnectItem[] | undefined = undefined;

      if (userAuth?.auth_token) {
        content = await new CommunityService(
          userAuth?.auth_token ?? ''
        ).getAllConnectItem(locale);

        return content;
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getCommunityProfile = createAsyncThunk<
  CommunityProfile,
  { userId: string },
  ThunkApiType<RootState>
>(
  CommunityActions.GET_COMMUNITY_PROFILE,
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let content: CommunityProfile | undefined = undefined;

      if (userAuth?.auth_token) {
        content = await new CommunityService(
          userAuth?.auth_token ?? ''
        ).getCommunityProfile(userId);
        console.log({ content });
        return content;
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
