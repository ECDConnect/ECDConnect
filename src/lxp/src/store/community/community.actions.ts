import {
  CommunityConnectInputModelInput,
  CommunityProfile,
  Connect,
  ConnectItem,
} from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { CommunityService } from '@/services/CommunityService';
import { CommunityProfileDto } from '@ecdlink/core';

export interface CommunityConnectDataForGGWithLocale {
  locale: string;
}

export const CommunityActions = {
  GET_ALL_CONNECT: 'getAllConnect',
  GET_ALL_CONNECT_ITEM: 'getAllConnectItem',
  GET_COMMUNITY_PROFILE: 'getCommunityProfile',
  SAVE_COMMUNITY_PROFILE: 'saveCommunityProfile',
  GET_USERS_TO_CONNECT_WITH: 'getUsersToConnectWith',
  GET_OTHER_CONNECTIONS: 'getOtherConnections',
  SAVE_COMMUNITY_PROFILE_CONNECTIONS: 'saveCommunityProfileConnections',
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
  any,
  { userId: string },
  ThunkApiType<RootState>
>(
  CommunityActions.GET_COMMUNITY_PROFILE,
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new CommunityService(
          userAuth?.auth_token ?? ''
        ).getCommunityProfile(userId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const saveCommunityProfile = createAsyncThunk<
  any,
  { input: any },
  ThunkApiType<RootState>
>(
  CommunityActions.SAVE_COMMUNITY_PROFILE,
  async ({ input }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userAuth },
      } = getState();
      if (userAuth?.auth_token) {
        const response = await new CommunityService(
          userAuth?.auth_token
        ).saveCommunityProfile(input);
        return response;
      } else return rejectWithValue('no access token, profile check required');
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getUsersToConnectWith = createAsyncThunk<
  any,
  {
    userId: string;
    provinceIds: string[];
    communitySkillIds: string[];
    connectionTypes: string[];
  },
  ThunkApiType<RootState>
>(
  CommunityActions.GET_USERS_TO_CONNECT_WITH,
  async (
    { userId, provinceIds, communitySkillIds, connectionTypes },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new CommunityService(
          userAuth?.auth_token ?? ''
        ).getUsersToConnectWith(
          userId,
          provinceIds,
          communitySkillIds,
          connectionTypes
        );
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getOtherConnections = createAsyncThunk<
  any,
  { userId: string; provinceIds: string[]; communitySkillIds: string[] },
  ThunkApiType<RootState>
>(
  CommunityActions.GET_OTHER_CONNECTIONS,
  async (
    { userId, provinceIds, communitySkillIds },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new CommunityService(
          userAuth?.auth_token ?? ''
        ).getOtherConnections(userId, provinceIds, communitySkillIds);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const saveCommunityProfileConnections = createAsyncThunk<
  any,
  { input: CommunityConnectInputModelInput[] },
  ThunkApiType<RootState>
>(
  CommunityActions.SAVE_COMMUNITY_PROFILE_CONNECTIONS,
  async ({ input }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userAuth },
      } = getState();
      if (userAuth?.auth_token) {
        const response = await new CommunityService(
          userAuth?.auth_token
        ).saveCommunityProfileConnections(input);
        return response;
      } else return rejectWithValue('no access token, profile check required');
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
