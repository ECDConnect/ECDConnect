import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { PQAService } from '@/services/PQAService';
import {
  FollowUpVisitModelInput,
  PractitionerTimeline,
  SupportVisitModelInput,
  UpdateVisitPlannedVisitDateModelInput,
  Visit,
  VisitData,
  VisitModelInput,
} from '@ecdlink/graphql';
import { MergedCmsVisitDataInputModelInput, PQAFormType } from './pqa.types';

export const PqaActions = {
  GET_PRACTITIONER_TIMELINE: 'getPractitionerTimeline',
  GET_VISIT_DATA_FOR_VISIT_ID: 'getVisitDataForVisitId',
  ADD_VISIT_FORM_DATA: 'addVisitFormData',
  ADD_SUPPORT_VISIT_FORM_DATA: 'addSupportVisitFormData',
  ADD_REQUESTED_SUPPORT_VISIT_FORM_DATA: 'addRequestedSupportVisitFormData',
  ADD_FOLLOW_UP_VISIT_FORM_DATA: 'addFollowUpVisitFormData',
  ADD_RE_ACCREDITATION_FOLLOW_UP_VISIT_FORM_DATA:
    'addReAccreditationFollowUpVisitFormData',
  ADD_SELF_ASSESSMENT_FOR_PRACTITIONER: 'addSelfAssessmentForPractitioner',
  UPDATE_PLANNEDVISITDATE: 'updatePlannedVisitDate',
  ADD_COACH_VISIT_INVITE_FOR_PRACTITIONER: 'addCoachVisitInviteForPractitioner',
};

export const addVisitFormData = createAsyncThunk<
  any,
  MergedCmsVisitDataInputModelInput | undefined,
  ThunkApiType<RootState>
>(
  PqaActions.ADD_VISIT_FORM_DATA,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      pqa: {
        prePqaFormData,
        pqaFormData,
        followUpVisitFormData,
        reAccreditationFollowUpVisitFormData,
        reAccreditationFormData,
        selfAssessmentFormData,
      },
    } = getState();

    let promises: Promise<boolean>[] = [];

    try {
      if (userAuth?.auth_token) {
        if (!!input && !!Object.keys(input).length) {
          const { syncId, ...payload } = input;

          const response = await new PQAService(
            userAuth?.auth_token
          ).addVisitData(payload);

          return response;
        }

        if (!!prePqaFormData?.length) {
          const prePqaPromises = prePqaFormData?.map(async (item) => {
            const { syncId, ...payload } = item.formData;

            return await new PQAService(userAuth?.auth_token).addVisitData(
              payload
            );
          });

          promises = [...promises, ...prePqaPromises];
        }

        if (!!pqaFormData?.length) {
          const pqaPromises = pqaFormData?.map(async (item) => {
            const { syncId, ...payload } = item.formData;

            return await new PQAService(userAuth?.auth_token).addVisitData(
              payload
            );
          });

          promises = [...promises, ...pqaPromises];
        }

        if (!!followUpVisitFormData?.length) {
          const followUpPromises = followUpVisitFormData?.map(async (item) => {
            const { syncId, ...payload } = item.formData;

            return await new PQAService(userAuth?.auth_token).addVisitData(
              payload
            );
          });

          promises = [...promises, ...followUpPromises];
        }

        if (!!reAccreditationFollowUpVisitFormData?.length) {
          const reAccreditationPromises =
            reAccreditationFollowUpVisitFormData?.map(async (item) => {
              const { syncId, ...payload } = item.formData;

              return await new PQAService(userAuth?.auth_token).addVisitData(
                payload
              );
            });

          promises = [...promises, ...reAccreditationPromises];
        }

        if (!!selfAssessmentFormData?.length) {
          const selfAssessmentPromises = selfAssessmentFormData?.map(
            async (item) => {
              const { syncId, ...payload } = item.formData;

              return await new PQAService(userAuth?.auth_token).addVisitData(
                payload
              );
            }
          );

          promises = [...promises, ...selfAssessmentPromises];
        }

        if (!!reAccreditationFormData?.length) {
          const reAccreditationPromises = reAccreditationFormData?.map(
            async (item) => {
              const { syncId, ...payload } = item.formData;

              return await new PQAService(userAuth?.auth_token).addVisitData(
                payload
              );
            }
          );

          promises = [...promises, ...reAccreditationPromises];
        }

        return promises?.length && Promise.all(promises);
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addSupportVisitFormData = createAsyncThunk<
  any,
  MergedCmsVisitDataInputModelInput | undefined,
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
          const { syncId, ...payload } = input;
          const response = await new PQAService(
            userAuth?.auth_token
          ).addSupportVisitData(payload);

          return response;
        }

        if (!!supportVisitFormData?.length) {
          const promises = supportVisitFormData?.map(async (item) => {
            const { syncId, ...payload } = item.formData;

            return await new PQAService(
              userAuth?.auth_token
            ).addSupportVisitData(payload);
          });

          return promises?.length && Promise.all(promises);
        }
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addRequestedSupportVisitFormData = createAsyncThunk<
  any,
  MergedCmsVisitDataInputModelInput | undefined,
  ThunkApiType<RootState>
>(
  PqaActions.ADD_REQUESTED_SUPPORT_VISIT_FORM_DATA,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      pqa: { requestedSupportVisitFormData },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        if (!!input && !!Object.keys(input).length) {
          const { syncId, ...payload } = input;

          const response = await new PQAService(
            userAuth?.auth_token
          ).addSupportVisitData(payload);

          return response;
        }

        if (!!requestedSupportVisitFormData?.length) {
          const promises = requestedSupportVisitFormData?.map(async (item) => {
            const { syncId, ...payload } = item.formData;

            return await new PQAService(
              userAuth?.auth_token
            ).addSupportVisitData(payload);
          });

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
      pqa: { followUpVisitFormData },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        if (!!input && !!Object.keys(input).length) {
          const response = await new PQAService(
            userAuth?.auth_token
          ).addFollowUpVisitForPractitioner(input);

          return response;
        }

        if (!!followUpVisitFormData?.length) {
          const promises = followUpVisitFormData?.map(
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
      pqa: { reAccreditationFollowUpVisitFormData },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        if (!!input && !!Object.keys(input).length) {
          const response = await new PQAService(
            userAuth?.auth_token
          ).addReAccreditationFollowUpVisitForPractitioner(input);

          return response;
        }

        if (!!reAccreditationFollowUpVisitFormData?.length) {
          const promises = reAccreditationFollowUpVisitFormData?.map(
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

export const addSelfAssessmentForPractitioner = createAsyncThunk<
  any,
  SupportVisitModelInput | undefined,
  ThunkApiType<RootState>
>(
  PqaActions.ADD_SELF_ASSESSMENT_FOR_PRACTITIONER,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      pqa: { selfAssessmentFormData },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        if (!!input && !!Object.keys(input).length) {
          const response = await new PQAService(
            userAuth?.auth_token
          ).addSelfAssessmentForPractitioner(input);

          return response;
        }

        if (!!selfAssessmentFormData?.length) {
          const promises = selfAssessmentFormData?.map(
            async (item) =>
              await new PQAService(
                userAuth?.auth_token
              ).addSelfAssessmentForPractitioner(item.formData)
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
    visitType: PQAFormType;
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

export const addCoachVisitInviteForPractitioner = createAsyncThunk<
  Visit | undefined,
  VisitModelInput,
  ThunkApiType<RootState>
>(
  PqaActions.ADD_COACH_VISIT_INVITE_FOR_PRACTITIONER,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        if (!!input && !!Object.keys(input).length) {
          const response = await new PQAService(
            userAuth?.auth_token
          ).addCoachVisitInviteForPractitioner(input);

          return response;
        }
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
