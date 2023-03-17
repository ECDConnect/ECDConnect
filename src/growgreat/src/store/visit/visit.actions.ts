import {} from '@/services/EventRecordService';
import { Visit } from '@/services/VisitService';
import {
  CmsVisitDataInputModelInput,
  HealthPromotion,
  MoreInformation,
  Progress_VisitDataStatus,
  VisitData,
  VisitVideos,
} from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { CompletedVisitsForVisitId } from './visit.types';

export const VisitActions = {
  GET_VISIT_STATUS: 'getHealthCareWorkerVisitStatus',
  ADD_VISIT_FORM_DATA: 'addVisitFormData',
  GET_HEALTH_PROMOTION: 'getHealthPromotion',
  GET_VISIT_VIDEOS: 'getVisitVideos',
  GET_MORE_INFORMATION: 'getMoreInformation',
  GET_COMPLETED_VISITS_FOR_VISIT_ID: 'getCompletedVisitsForVisitId',
  GET_PREVIOUS_VISIT_INFORMATION_FOR_INFANT:
    'getPreviousVisitInformationForInfant',
  GET_GROWTH_DATA_FOR_INFANT: 'getGrowthDataForInfant',
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

export const getCompletedVisitsForVisitId = createAsyncThunk<
  CompletedVisitsForVisitId,
  { visitId: string },
  ThunkApiType<RootState>
>(
  VisitActions.GET_COMPLETED_VISITS_FOR_VISIT_ID,
  async ({ visitId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let content: CompletedVisitsForVisitId | undefined = {
        visitId,
        visits: [],
      };

      if (userAuth?.auth_token) {
        content.visits = await new Visit(
          userAuth?.auth_token ?? ''
        ).getCompletedVisitsForVisitId(visitId);
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

export const getPreviousVisitInformationForInfant = createAsyncThunk<
  Progress_VisitDataStatus,
  { visitId: string },
  ThunkApiType<RootState>
>(
  VisitActions.GET_PREVIOUS_VISIT_INFORMATION_FOR_INFANT,
  async ({ visitId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let content: Progress_VisitDataStatus | undefined = undefined;

      if (userAuth?.auth_token) {
        content = await new Visit(
          userAuth?.auth_token ?? ''
        ).getPreviousVisitInformationForInfant(visitId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!content) {
        return rejectWithValue(
          'Error getting previous visit information for infant'
        );
      }
      return content;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getGrowthDataForInfant = createAsyncThunk<
  VisitData,
  { infantId: string },
  ThunkApiType<RootState>
>(
  VisitActions.GET_PREVIOUS_VISIT_INFORMATION_FOR_INFANT,
  async ({ infantId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let content: VisitData | undefined = undefined;

      if (userAuth?.auth_token) {
        content = await new Visit(
          userAuth?.auth_token ?? ''
        ).getGrowthDataForInfant(infantId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!content) {
        return rejectWithValue('Error getting growth data for infant');
      }
      return content;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
