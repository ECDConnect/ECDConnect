import {
  Connect,
  ConnectItem,
  MoreInformation,
  MutationSaveWelcomeMessageArgs,
} from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { CommunityService } from '@/services/CommunityService';
import InfoService from '@/services/InfoService/InfoService';
import { differenceInDays } from 'date-fns';
import { ClinicDto } from '@ecdlink/core';
import { ClinicService } from '@/services/Clinic';

export const CommunityActions = {
  GET_ALL_CONNECT: 'getAllConnect',
  GET_ALL_CONNECT_ITEM: 'getAllConnectItem',
  SAVE_WELCOME_MESSAGE: 'saveWelcomeMessage',
  GET_MORE_INFORMATION: 'getMoreInformation',
  GET_POINTS_ACTIVITY_INFO: 'getPointsActivityInfo',
  GET_CLINIC_BY_ID: 'getClinicById',
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

export const saveWelcomeMessage = createAsyncThunk<
  boolean,
  MutationSaveWelcomeMessageArgs,
  ThunkApiType<RootState>
>(
  CommunityActions.SAVE_WELCOME_MESSAGE,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new CommunityService(
          userAuth?.auth_token
        ).saveWelcomeMessage(input);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getMoreInformation = createAsyncThunk<
  MoreInformation[],
  { section: string; locale: string; tab: 'team' },
  ThunkApiType<RootState>
>(
  CommunityActions.GET_MORE_INFORMATION,
  async ({ locale, section }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      community: { team },
    } = getState();

    try {
      const currentInfo = team?.earnPointsInfo?.find((item) => item[locale])?.[
        locale
      ];

      if (currentInfo) {
        const daysSinceLateLoad = differenceInDays(
          new Date(),
          new Date(currentInfo?.dateLoaded)
        );

        if (daysSinceLateLoad < 1) {
          return currentInfo?.data;
        }
      }
      if (userAuth?.auth_token) {
        return await new InfoService().getMoreInformation(section, locale);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getPointsActivityInfo = createAsyncThunk<
  MoreInformation[],
  { section: string; locale: string; activitySlug: string },
  ThunkApiType<RootState>
>(
  CommunityActions.GET_POINTS_ACTIVITY_INFO,
  async ({ locale, section, activitySlug }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      community: { team },
    } = getState();

    try {
      const activity = team?.activityInfo?.find((item) => item[activitySlug])?.[
        activitySlug
      ];
      const currentInfo = activity?.[locale];

      if (currentInfo) {
        const daysSinceLateLoad = differenceInDays(
          new Date(),
          new Date(currentInfo?.dateLoaded)
        );

        if (daysSinceLateLoad < 1) {
          return currentInfo?.data;
        }
      }
      if (userAuth?.auth_token) {
        return await new InfoService().getMoreInformation(section, locale);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getClinicById = createAsyncThunk<
  ClinicDto,
  { clinicId: string },
  ThunkApiType<RootState>
>(
  CommunityActions.GET_CLINIC_BY_ID,
  async ({ clinicId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new ClinicService(
          userAuth?.auth_token ?? ''
        ).getClinicById(clinicId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
