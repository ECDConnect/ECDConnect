import {} from '@/services/EventRecordService';
import { Visit } from '@/services/VisitService';
import {
  ClientSummaryByPriority,
  CmsVisitDataInputModelInput,
  HcwHighlights,
  HealthPromotion,
  Infographics,
  DangerSign,
  MoreInformation,
  Progress_VisitDataStatus,
  VisitData,
  VisitVideos,
  DangerSignTranslation,
} from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { CompletedVisitsForVisitId } from './visit.types';

export interface VisitVideosWithLocale extends VisitVideos {
  locale: string;
}

export const VisitActions = {
  GET_VISIT_STATUS: 'getHealthCareWorkerVisitStatus',
  ADD_VISIT_FORM_DATA: 'addVisitFormData',
  ADD_VISIT_FOR_MOM_FORM_DATA: 'addVisitForMomFormData',
  GET_HEALTH_PROMOTION: 'getHealthPromotion',
  GET_VISIT_VIDEOS: 'getVisitVideos',
  GET_INFO_GRAPHICS: 'getInfographics',
  GET_DANGER_SIGNS: 'getDangerSigns',
  GET_DANGER_TRANSLATION: 'getDangerSignsTranslation',
  GET_MORE_INFORMATION: 'getMoreInformation',
  GET_COMPLETED_VISITS_FOR_VISIT_ID: 'getCompletedVisitsForVisitId',
  GET_MOM_COMPLETED_VISITS_FOR_VISIT_ID: 'getMomCompletedVisitsForVisitId',
  GET_PREVIOUS_VISIT_INFORMATION_FOR_INFANT:
    'getPreviousVisitInformationForInfant',
  GET_GROWTH_DATA_FOR_INFANT: 'getGrowthDataForInfant',
  GET_VISIT_ANSWERS_FOR_INFANT: 'getVisitAnswersForInfant',
  GET_VISIT_ANSWERS_FOR_MOTHER: 'getVisitAnswersForMother',
  GET_HCW_HIGHLIGHTS: 'getHealthCareWorkerHighlights',
  GET_PREVIOUS_VISIT_INFORMATION_FOR_MOTHER:
    'getPreviousVisitInformationForMother',
  GET_MOTHER_SUMMARY_BY_PRIORITY: 'GetMotherSummaryByPriority',
  GET_INFANT_SUMMARY_BY_PRIORITY: 'GetInfantSummaryByPriority',
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
  MoreInformation,
  { section: string; locale: string },
  ThunkApiType<RootState>
>(
  VisitActions.GET_MORE_INFORMATION,
  async ({ locale, section }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        const [content] = await new Visit(
          userAuth?.auth_token ?? ''
        ).getMoreInformation(section, locale);

        return content;
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getHealthPromotion = createAsyncThunk<
  HealthPromotion,
  { section: string; locale: string; title?: string },
  ThunkApiType<RootState>
>(
  VisitActions.GET_HEALTH_PROMOTION,
  async ({ locale, section, title }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        const [content] = await new Visit(
          userAuth?.auth_token ?? ''
        ).getHealthPromotion(section, locale, title);

        return content;
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getVisitVideos = createAsyncThunk<
  VisitVideosWithLocale[],
  { section: string; locale: string },
  ThunkApiType<RootState>
>(
  VisitActions.GET_VISIT_VIDEOS,
  async ({ locale, section }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let content: VisitVideosWithLocale[] = [];

      if (userAuth?.auth_token) {
        const response = await new Visit(
          userAuth?.auth_token ?? ''
        ).getVisitVideos(section, locale);

        content = response.map((item) => ({ ...item, locale }));
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

export const getInfographics = createAsyncThunk<
  Infographics,
  { section: string; locale: string },
  ThunkApiType<RootState>
>(
  VisitActions.GET_INFO_GRAPHICS,
  async ({ locale, section }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        const [content] = await new Visit(
          userAuth?.auth_token ?? ''
        ).getInfographics(section, locale);

        return content;
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getDangerSigns = createAsyncThunk<
  DangerSign,
  { section: string; locale: string },
  ThunkApiType<RootState>
>(
  VisitActions.GET_DANGER_SIGNS,
  async ({ locale, section }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        const [content] = await new Visit(
          userAuth?.auth_token ?? ''
        ).getDangerSigns(section, locale);

        return content;
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getDangerSignsTranslation = createAsyncThunk<
  DangerSignTranslation[],
  { section: string; toTranslate: string },
  ThunkApiType<RootState>
>(
  VisitActions.GET_DANGER_TRANSLATION,
  async ({ toTranslate, section }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        const content = await new Visit(
          userAuth?.auth_token ?? ''
        ).GetDangerSignTranslations(section, toTranslate);

        return content;
      } else {
        return rejectWithValue('no access token, profile check required');
      }
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
  VisitData[],
  { infantId: string },
  ThunkApiType<RootState>
>(
  VisitActions.GET_GROWTH_DATA_FOR_INFANT,
  async ({ infantId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let content: VisitData[] | undefined = undefined;

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

export const getVisitAnswersForInfant = createAsyncThunk<
  VisitData[],
  { visitId: string; visitName: string; visitSection: string },
  ThunkApiType<RootState>
>(
  VisitActions.GET_VISIT_ANSWERS_FOR_INFANT,
  async (
    { visitId, visitName, visitSection },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let content: VisitData[] | undefined = undefined;

      if (userAuth?.auth_token) {
        content = await new Visit(
          userAuth?.auth_token ?? ''
        ).getVisitAnswersForInfant(visitId, visitName, visitSection);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!content) {
        return rejectWithValue('Error getting visit answers for infant');
      }
      return content;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getHealthCareWorkerHighlights = createAsyncThunk<
  HcwHighlights,
  { userId: string },
  ThunkApiType<RootState>
>(
  VisitActions.GET_HCW_HIGHLIGHTS,
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let content: HcwHighlights | undefined = undefined;

      if (userAuth?.auth_token) {
        content = await new Visit(
          userAuth?.auth_token ?? ''
        ).getHealthCareWorkerHighlights(userId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!content) {
        return rejectWithValue(
          'Error getting highlights for Community Health Worker'
        );
      }
      return content;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getPreviousVisitInformationForMother = createAsyncThunk<
  Progress_VisitDataStatus,
  { visitId: string },
  ThunkApiType<RootState>
>(
  VisitActions.GET_PREVIOUS_VISIT_INFORMATION_FOR_MOTHER,
  async ({ visitId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let content: Progress_VisitDataStatus | undefined = undefined;

      if (userAuth?.auth_token) {
        content = await new Visit(
          userAuth?.auth_token ?? ''
        ).getPreviousVisitInformationForMother(visitId);
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

export const GetMotherSummaryByPriority = createAsyncThunk<
  ClientSummaryByPriority[],
  { visitId: string },
  ThunkApiType<RootState>
>(
  VisitActions.GET_MOTHER_SUMMARY_BY_PRIORITY,
  async ({ visitId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      let content: ClientSummaryByPriority[] | undefined = undefined;

      if (userAuth?.auth_token) {
        content = await new Visit(
          userAuth?.auth_token ?? ''
        ).GetMotherSummaryByPriority(visitId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!content) {
        return rejectWithValue(
          'Error getting mother summary by priority for mother'
        );
      }
      return content;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const GetInfantSummaryByPriority = createAsyncThunk<
  ClientSummaryByPriority[],
  { visitId: string },
  ThunkApiType<RootState>
>(
  VisitActions.GET_INFANT_SUMMARY_BY_PRIORITY,
  async ({ visitId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      let content: ClientSummaryByPriority[] | undefined = undefined;

      if (userAuth?.auth_token) {
        content = await new Visit(
          userAuth?.auth_token ?? ''
        ).GetInfantSummaryByPriority(visitId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!content) {
        return rejectWithValue('Error getting infant summary by priority');
      }
      return content;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addVisitForMomFormData = createAsyncThunk<
  any,
  CmsVisitDataInputModelInput,
  ThunkApiType<RootState>
>(
  VisitActions.ADD_VISIT_FOR_MOM_FORM_DATA,
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

export const getMomCompletedVisitsForVisitId = createAsyncThunk<
  CompletedVisitsForVisitId,
  { visitId: string },
  ThunkApiType<RootState>
>(
  VisitActions.GET_MOM_COMPLETED_VISITS_FOR_VISIT_ID,
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

export const getVisitAnswersForMother = createAsyncThunk<
  VisitData[],
  { visitId: string; visitName: string; visitSection: string },
  ThunkApiType<RootState>
>(
  VisitActions.GET_VISIT_ANSWERS_FOR_MOTHER,
  async (
    { visitId, visitName, visitSection },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let content: VisitData[] | undefined = undefined;

      if (userAuth?.auth_token) {
        content = await new Visit(
          userAuth?.auth_token ?? ''
        ).getVisitAnswersForMother(visitId, visitName, visitSection);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!content) {
        return rejectWithValue('Error getting visit answers for mother');
      }
      return content;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
