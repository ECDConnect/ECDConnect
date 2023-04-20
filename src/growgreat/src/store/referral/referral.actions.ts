import { Referral } from '@/services/ReferralService';
import {
  VisitBackReferralModelInput,
  VisitDataStatus,
  VisitDataStatusFilterInput,
  VisitVideos,
} from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';

export interface VisitVideosWithLocale extends VisitVideos {
  locale: string;
}

export const ReferralActions = {
  GET_REFERRAL_FOR_INFANT: 'getReferralsForInfant',
  UPDATE_VISIT_DATA_STATUS: 'updateVisitDataStatus',
  GET_REFERRAL_FOR_VISIT_ID: 'getReferralsForVisitId',
  ADD_VISIT_BACK_REFERRAL: 'addVisitBackReferral',
};

export const getReferralsForInfant = createAsyncThunk<
  VisitDataStatus[],
  { infantId: string },
  ThunkApiType<RootState>
>(
  ReferralActions.GET_REFERRAL_FOR_INFANT,
  async ({ infantId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let content: VisitDataStatus[] | undefined = undefined;

      if (userAuth?.auth_token) {
        content = await new Referral(
          userAuth?.auth_token ?? ''
        ).getReferralsForInfant(infantId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!content) {
        return rejectWithValue('Error getting more information');
      }

      return content;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getReferralsForVisitId = createAsyncThunk<
  VisitDataStatus[],
  { visitId: string },
  ThunkApiType<RootState>
>(
  ReferralActions.GET_REFERRAL_FOR_VISIT_ID,
  async ({ visitId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let content: VisitDataStatus[] | undefined = undefined;

      if (userAuth?.auth_token) {
        content = await new Referral(
          userAuth?.auth_token ?? ''
        ).getReferralsForVisitId(visitId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!content) {
        return rejectWithValue('Error getting more information');
      }

      return content;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateVisitDataStatus = createAsyncThunk<
  {},
  { input: VisitDataStatusFilterInput[] },
  ThunkApiType<RootState>
>(
  ReferralActions.UPDATE_VISIT_DATA_STATUS,
  async ({ input }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        new Referral(userAuth?.auth_token ?? '').updateVisitDataStatus(input);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addVisitBackReferral = createAsyncThunk<
  {},
  { input: VisitBackReferralModelInput },
  ThunkApiType<RootState>
>(
  ReferralActions.ADD_VISIT_BACK_REFERRAL,
  async ({ input }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        new Referral(userAuth?.auth_token ?? '').addVisitBackReferral(input);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
