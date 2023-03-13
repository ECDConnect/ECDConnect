import {} from '@/services/EventRecordService';
import { Visit } from '@/services/VisitService';
import {
  CmsVisitDataInputModelInput,
  HealthPromotion,
  MoreInformation,
  VisitVideos,
} from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';

export const VisitActions = {
  GET_VISIT_STATUS: 'getHealthCareWorkerVisitStatus',
  ADD_VISIT_FORM_DATA: 'addVisitFormData',
  GET_HEALTH_PROMOTION: 'getHealthPromotion',
  GET_VISIT_VIDEOS: 'getVisitVideos',
  GET_MORE_INFORMATION: 'getMoreInformation',
};

export const getHealthCareWorkerVisitStatus = createAsyncThunk<
  any,
  { userId: string },
  ThunkApiType<RootState>
>(
  VisitActions.GET_VISIT_STATUS,
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        const response = await new Visit(
          userAuth?.auth_token
        ).getHealthCareWorkerVisitStatus(userId);

        return response;
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addVisitFormData = createAsyncThunk<
  any,
  CmsVisitDataInputModelInput,
  ThunkApiType<RootState>
>(
  VisitActions.ADD_VISIT_FORM_DATA,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        const response = await new Visit(userAuth?.auth_token).addVisitFormData(
          input
        );

        return response;
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getMoreInformation = createAsyncThunk<
  MoreInformation[],
  { section: string; locale: string },
  ThunkApiType<RootState>
>(
  VisitActions.GET_MORE_INFORMATION,
  async ({ locale, section }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let content: MoreInformation[] = [];

      if (userAuth?.auth_token) {
        content = await new Visit(
          userAuth?.auth_token ?? ''
        ).getMoreInformation(section, locale);
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

export const getHealthPromotion = createAsyncThunk<
  HealthPromotion[],
  { section: string; locale: string },
  ThunkApiType<RootState>
>(
  VisitActions.GET_HEALTH_PROMOTION,
  async ({ locale, section }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let content: HealthPromotion[] = [];

      if (userAuth?.auth_token) {
        content = await new Visit(
          userAuth?.auth_token ?? ''
        ).getHealthPromotion(section, locale);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!content) {
        return rejectWithValue('Error getting health promotion');
      }

      return content;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getVisitVideos = createAsyncThunk<
  VisitVideos[],
  { section: string; locale: string },
  ThunkApiType<RootState>
>(
  VisitActions.GET_VISIT_VIDEOS,
  async ({ locale, section }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let content: VisitVideos[] = [];

      if (userAuth?.auth_token) {
        content = await new Visit(userAuth?.auth_token ?? '').getVisitVideos(
          section,
          locale
        );
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!content) {
        return rejectWithValue('Error getting visit videos');
      }

      return content;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
