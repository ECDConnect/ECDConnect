import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { PQAService } from '@/services/PQAService';
import { PractitionerTimeLine } from '@ecdlink/graphql';

export const PqaActions = {
  GET_PRACTITIONER_TIMELINE: 'getPractitionerTimeline',
};

export const getPractitionerTimeline = createAsyncThunk<
  PractitionerTimeLine,
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
