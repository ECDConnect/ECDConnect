import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { PQAService } from '@/services/PQAService';
import {
  CmsVisitDataInputModelInput,
  PractitionerTimeline,
  SupportVisitModelInput,
  VisitData,
} from '@ecdlink/graphql';

export const PqaActions = {
  GET_PRACTITIONER_TIMELINE: 'getPractitionerTimeline',
  GET_VISIT_DATA_FOR_VISIT_ID: 'getVisitDataForVisitId',
  ADD_VISIT_FORM_DATA: 'addVisitFormData',
  ADD_SUPPORT_VISIT_FORM_DATA: 'addSupportVisitFormData',
};

export const addVisitFormData = createAsyncThunk<
  any,
  CmsVisitDataInputModelInput,
  ThunkApiType<RootState>
>(
  PqaActions.ADD_VISIT_FORM_DATA,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      pqa: { prePqaFormData },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        if (!!input) {
          const response = await new PQAService(
            userAuth?.auth_token
          ).addVisitData(input);

          return response;
        }

        const promises = prePqaFormData?.map(
          async (item) =>
            await new PQAService(userAuth?.auth_token).addVisitData(
              item.formData
            )
        );

        return promises?.length && Promise.all(promises);
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addSupportVisitFormData = createAsyncThunk<
  any,
  SupportVisitModelInput | undefined,
  ThunkApiType<RootState>
>(
  PqaActions.ADD_SUPPORT_VISIT_FORM_DATA,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      pqa: { supportVisitFormData },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        if (!!input) {
          const response = await new PQAService(
            userAuth?.auth_token
          ).addSupportVisitForPractitioner(input);

          return response;
        }

        const promises = supportVisitFormData?.map(
          async (item) =>
            await new PQAService(
              userAuth?.auth_token
            ).addSupportVisitForPractitioner(item.formData)
        );

        return promises?.length && Promise.all(promises);
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getVisitDataForVisitId = createAsyncThunk<
  VisitData[],
  { visitId: string; userId: string },
  ThunkApiType<RootState>
>(
  PqaActions.GET_VISIT_DATA_FOR_VISIT_ID,
  async ({ visitId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new PQAService(
          userAuth?.auth_token
        ).getVisitDataForVisitId(visitId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getPractitionerTimeline = createAsyncThunk<
  PractitionerTimeline,
  { userId: string },
  ThunkApiType<RootState>
>(
  PqaActions.GET_PRACTITIONER_TIMELINE,
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new PQAService(
          userAuth?.auth_token
        ).getPractitionerTimeline(userId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
