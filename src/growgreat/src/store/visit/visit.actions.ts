import {} from '@/services/EventRecordService';
import { Visit } from '@/services/VisitService';
import {} from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';

export const VisitActions = {
  GET_VISIT_STATUS: 'getHealthCareWorkerVisitStatus',
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
