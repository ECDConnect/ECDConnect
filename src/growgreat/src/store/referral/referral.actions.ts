import { Referral } from '@/services/ReferralService';
import { VisitDataStatus, VisitVideos } from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';

export interface VisitVideosWithLocale extends VisitVideos {
  locale: string;
}

export const VisitActions = {
  GET_REFERRAL_FOR_INFANT: 'getReferralsForInfant',
};

export const getReferralsForInfant = createAsyncThunk<
  VisitDataStatus[],
  { infantId: string },
  ThunkApiType<RootState>
>(
  VisitActions.GET_REFERRAL_FOR_INFANT,
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
