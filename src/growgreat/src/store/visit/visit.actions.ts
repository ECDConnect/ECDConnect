import {} from '@/services/EventRecordService';
import { Visit } from '@/services/VisitService';
import { CmsVisitDataInputModelInput } from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';

export const VisitActions = {
  GET_VISIT_STATUS: 'getHealthCareWorkerVisitStatus',
  ADD_VISIT_FORM_DATA: 'addVisitFormData',
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
