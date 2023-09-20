import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { CoachingClub } from '@ecdlink/graphql';
import { ClubService } from '@/services/ClubService';

export const ClubActions = {
  GET_ALL_CLUBS_FOR_COACH: 'getAllClubsForCoach',
};

export const getAllClubsForCoach = createAsyncThunk<
  CoachingClub[],
  { userId: string },
  ThunkApiType<RootState>
>(
  ClubActions.GET_ALL_CLUBS_FOR_COACH,
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new ClubService(userAuth?.auth_token).getAllClubsForCoach(
          userId
        );
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
