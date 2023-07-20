import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { PQAService } from '@/services/PQAService';
import {
  CmsVisitDataInputModelInput,
  FollowUpVisitModelInput,
  PractitionerTimeline,
  SupportVisitModelInput,
  UpdateVisitPlannedVisitDateModelInput,
  VisitData,
} from '@ecdlink/graphql';

export const PqaActions = {
  GET_PRACTITIONER_TIMELINE: 'getPractitionerTimeline',
  GET_VISIT_DATA_FOR_VISIT_ID: 'getVisitDataForVisitId',
  ADD_VISIT_FORM_DATA: 'addVisitFormData',
  ADD_RE_ACCREDITATION_VISIT_FORM_DATA: 'addReAccreditationVisitData',
  ADD_SUPPORT_VISIT_FORM_DATA: 'addSupportVisitFormData',
  ADD_FOLLOW_UP_VISIT_FORM_DATA: 'addFollowUpVisitFormData',
  ADD_RE_ACCREDITATION_FOLLOW_UP_VISIT_FORM_DATA:
    'addReAccreditationFollowUpVisitFormData',
  UPDATE_PLANNEDVISITDATE: 'updatePlannedVisitDate',
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
      pqa: { prePqaFormData, pqaFormData, reAccreditationFormData },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        if (!!Object.keys(input).length) {
          const response = await new PQAService(
            userAuth?.auth_token
          ).addVisitData(input);

          return response;
        }

        if (!!prePqaFormData?.length) {
          const promises = prePqaFormData?.map(
            async (item) =>
              await new PQAService(userAuth?.auth_token).addVisitData(
                item.formData
              )
          );

          return promises?.length && Promise.all(promises);
        }

        if (!!pqaFormData?.length) {
          const promises = pqaFormData?.map(
            async (item) =>
              await new PQAService(userAuth?.auth_token).addVisitData(
                item.formData
              )
          );

          return promises?.length && Promise.all(promises);
        }

        if (!!reAccreditationFormData?.length) {
          const promises = reAccreditationFormData?.map(
            async (item) =>
              await new PQAService(userAuth?.auth_token).addVisitData(
                item.formData
              )
          );

          return promises?.length && Promise.all(promises);
        }
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addReAccreditationVisitData = createAsyncThunk<
  any,
  CmsVisitDataInputModelInput,
  ThunkApiType<RootState>
>(
  PqaActions.ADD_RE_ACCREDITATION_VISIT_FORM_DATA,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      pqa: { reAccreditationFormData },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        if (!!Object.keys(input).length) {
          const response = await new PQAService(
            userAuth?.auth_token
          ).addReAccreditationVisitData(input);

          return response;
        }

        if (!!reAccreditationFormData?.length) {
          const promises = reAccreditationFormData?.map(
            async (item) =>
              await new PQAService(
                userAuth?.auth_token
              ).addReAccreditationVisitData(item.formData)
          );

          return promises?.length && Promise.all(promises);
        }
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
        if (!!input && !!Object.keys(input).length) {
          const response = await new PQAService(
            userAuth?.auth_token
          ).addSupportVisitForPractitioner(input);

          return response;
        }

        if (!!supportVisitFormData?.length) {
          const promises = supportVisitFormData?.map(
            async (item) =>
              await new PQAService(
                userAuth?.auth_token
              ).addSupportVisitForPractitioner(item.formData)
          );

          return promises?.length && Promise.all(promises);
        }
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addFollowUpVisitForPractitioner = createAsyncThunk<
  any,
  FollowUpVisitModelInput | undefined,
  ThunkApiType<RootState>
>(
  PqaActions.ADD_FOLLOW_UP_VISIT_FORM_DATA,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      pqa: { supportVisitFormData },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        if (!!input && !!Object.keys(input).length) {
          const response = await new PQAService(
            userAuth?.auth_token
          ).addFollowUpVisitForPractitioner(input);

          return response;
        }

        if (!!supportVisitFormData?.length) {
          const promises = supportVisitFormData?.map(
            async (item) =>
              await new PQAService(
                userAuth?.auth_token
              ).addFollowUpVisitForPractitioner(item.formData)
          );

          return promises?.length && Promise.all(promises);
        }
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addReAccreditationFollowUpVisitForPractitioner = createAsyncThunk<
  any,
  FollowUpVisitModelInput | undefined,
  ThunkApiType<RootState>
>(
  PqaActions.ADD_RE_ACCREDITATION_FOLLOW_UP_VISIT_FORM_DATA,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      pqa: { supportVisitFormData },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        if (!!input && !!Object.keys(input).length) {
          const response = await new PQAService(
            userAuth?.auth_token
          ).addReAccreditationFollowUpVisitForPractitioner(input);

          return response;
        }

        if (!!supportVisitFormData?.length) {
          const promises = supportVisitFormData?.map(
            async (item) =>
              await new PQAService(
                userAuth?.auth_token
              ).addReAccreditationFollowUpVisitForPractitioner(item.formData)
          );

          return promises?.length && Promise.all(promises);
        }
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getVisitDataForVisitId = createAsyncThunk<
  VisitData[],
  {
    visitId: string;
    visitType: 'pre-pqa' | 'pqa' | 'reAccreditation-follow-up';
  },
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

export const updateVisitPlannedVisitDate = createAsyncThunk<
  any,
  UpdateVisitPlannedVisitDateModelInput,
  ThunkApiType<RootState>
>(
  PqaActions.UPDATE_PLANNEDVISITDATE,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      pqa,
    } = getState();

    try {
      if (userAuth?.auth_token) {
        if (!!input && !!Object.keys(input).length) {
          const response = await new PQAService(
            userAuth?.auth_token
          ).updateVisitPlannedVisitDate(input);

          return response;
        }
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
