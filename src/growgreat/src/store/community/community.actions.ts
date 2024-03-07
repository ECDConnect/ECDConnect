import {
  AddBreastFeedingClubInputModelInput,
  Connect,
  ConnectItem,
  MoreInformation,
} from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { CommunityService } from '@/services/CommunityService';
import InfoService from '@/services/InfoService/InfoService';
import { differenceInDays } from 'date-fns';
import {
  BreastFeedingClubDto,
  CaregiverBaseDto,
  ClinicDto,
  LeagueWithClinicRankingsDto,
} from '@ecdlink/core';

export const CommunityActions = {
  GET_ALL_CONNECT: 'getAllConnect',
  GET_ALL_CONNECT_ITEM: 'getAllConnectItem',
  GET_MORE_INFORMATION: 'getMoreInformation',
  GET_LEAGUE_BY_ID: 'getLeagueById',
  GET_POINTS_ACTIVITY_INFO: 'getPointsActivityInfo',
  GET_CLINIC_BY_ID: 'getClinicById',
  GET_AVAILABLE_CAREGIVERS_FOR_BREAST_FEEDING_CLUB:
    'getAvailableCaregiversForBreastFeedingClub',
  GET_BREAST_FEEDING_CLUBS: 'getBreastFeedingClubs',
  ADD_BREAST_FEEDING_CLUB: 'addBreastFeedingClub',
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
  { clinicId: string; forceReload?: boolean },
  ThunkApiType<RootState>
>(
  CommunityActions.GET_CLINIC_BY_ID,
  async ({ clinicId, forceReload }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      community: { team },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        if (team?.clinic?.data && !forceReload) {
          const daysSinceLateLoad = differenceInDays(
            new Date(),
            new Date(team?.clinic?.dateLoaded)
          );

          if (daysSinceLateLoad < 1) {
            return team?.clinic?.data;
          }
        }

        return await new CommunityService(
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

export const getLeagueById = createAsyncThunk<
  LeagueWithClinicRankingsDto,
  { leagueId: string; forceReload?: boolean },
  ThunkApiType<RootState>
>(
  CommunityActions.GET_LEAGUE_BY_ID,
  async ({ leagueId, forceReload }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      community: { league },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        if (league?.data && !forceReload) {
          const daysSinceLateLoad = differenceInDays(
            new Date(),
            new Date(league?.dateLoaded)
          );

          if (daysSinceLateLoad < 1) {
            return league?.data;
          }
        }

        return await new CommunityService(
          userAuth?.auth_token ?? ''
        ).getLeagueById(leagueId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAvailableCaregiversForBreastFeedingClub = createAsyncThunk<
  CaregiverBaseDto[],
  { clinicId: string },
  ThunkApiType<RootState>
>(
  CommunityActions.GET_AVAILABLE_CAREGIVERS_FOR_BREAST_FEEDING_CLUB,
  async ({ clinicId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let caregivers: CaregiverBaseDto[] | undefined = undefined;

      if (userAuth?.auth_token) {
        caregivers = await new CommunityService(
          userAuth?.auth_token ?? ''
        ).getAvailableCaregiversForBreastFeedingClub(clinicId);

        return caregivers;
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getBreastFeedingClubs = createAsyncThunk<
  BreastFeedingClubDto[],
  { clinicId: string },
  ThunkApiType<RootState>
>(
  CommunityActions.GET_BREAST_FEEDING_CLUBS,
  async ({ clinicId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let clubs: BreastFeedingClubDto[] | undefined = undefined;

      if (userAuth?.auth_token) {
        clubs = await new CommunityService(
          userAuth?.auth_token ?? ''
        ).getBreastFeedingClubs(clinicId);

        return clubs;
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addBreastFeedingClub = createAsyncThunk<
  BreastFeedingClubDto,
  AddBreastFeedingClubInputModelInput,
  ThunkApiType<RootState>
>(
  CommunityActions.ADD_BREAST_FEEDING_CLUB,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (userAuth?.auth_token) {
        return await new CommunityService(
          userAuth?.auth_token
        ).addBreastFeedingClub(input);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
