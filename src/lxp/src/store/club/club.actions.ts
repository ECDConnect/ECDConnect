import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import {
  ActivityBeCreative,
  ActivityMeetRegular,
  Club,
  ClubLeader,
  ClubMember,
  Coach,
  CoachingClub,
  CoachingClubBase,
  MutationChangeClubNameArgs,
  MutationUpdateCoachAboutInfoArgs,
  NewClubInput,
  NewClubMemberInput,
  QueryActivityBeCreativeDetailsArgs,
  QueryActivityMeetRegularDetailsArgs,
} from '@ecdlink/graphql';
import { ClubService } from '@/services/ClubService';
import { NewClubLeaderInput } from '@/services/ClubService/types';

export const ClubActions = {
  GET_ALL_CLUBS_FOR_COACH: 'getAllClubsForCoach',
  GET_ALL_CLUB_MEMBERS_FOR_COACH: 'getAllClubMembersForCoach',
  GET_ALL_CLUBS_DETAILS_FOR_COACH: 'getAllClubsDetailsForCoach',
  GET_CLUBS_MEMBERS: 'getClubsMembers',
  ADD_NEW_CLUB: 'addNewClub',
  ADD_NEW_CLUB_LEADER: 'addNewClubLeader',
  ADD_NEW_CLUB_MEMBERS: 'addNewClubMembers',
  MOVE_CLUB_MEMBERS: 'moveClubMembers',
  CHANGE_CLUB_NAME: 'changeClubName',
  UPDATE_COACH_ABOUT_INFO: 'updateCoachAboutInfo',
  GET_ACTIVITY_MEET_REGULAR_DETAILS: 'getActivityMeetRegularDetails',
  GET_ACTIVITY_BE_CREATIVE_DETAILS: 'getActivityBeCreativeDetails',
};

export const getAllClubsForCoach = createAsyncThunk<
  CoachingClubBase[],
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

export const getAllClubsDetailsForCoach = createAsyncThunk<
  CoachingClub[],
  { userId: string; clubId: string },
  ThunkApiType<RootState>
>(
  ClubActions.GET_ALL_CLUBS_DETAILS_FOR_COACH,
  async ({ userId, clubId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new ClubService(
          userAuth?.auth_token
        ).getAllClubsDetailsForCoach(userId, clubId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAllClubMembersForCoach = createAsyncThunk<
  (CoachingClub['id'] & CoachingClub['clubMembers'])[],
  { userId: string },
  ThunkApiType<RootState>
>(
  ClubActions.GET_ALL_CLUB_MEMBERS_FOR_COACH,
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new ClubService(
          userAuth?.auth_token
        ).getAllClubsMembersForCoach(userId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getClubsMembers = createAsyncThunk<
  ClubMember[],
  { clubIds: string[] },
  ThunkApiType<RootState>
>(
  ClubActions.GET_CLUBS_MEMBERS,
  async ({ clubIds }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    if (clubIds.length === 0) return [];

    try {
      if (userAuth?.auth_token) {
        return await new ClubService(userAuth?.auth_token).getClubsMembers(
          clubIds
        );
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addNewClubMembers = createAsyncThunk<
  boolean,
  { input: NewClubMemberInput },
  ThunkApiType<RootState>
>(
  ClubActions.ADD_NEW_CLUB_MEMBERS,
  async ({ input }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new ClubService(userAuth?.auth_token).addNewClubMembers(
          input
        );
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const moveClubMembers = createAsyncThunk<
  boolean,
  { input: NewClubMemberInput },
  ThunkApiType<RootState>
>(
  ClubActions.MOVE_CLUB_MEMBERS,
  async ({ input }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new ClubService(userAuth?.auth_token).moveClubMembers(
          input
        );
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addNewClub = createAsyncThunk<
  Club,
  { input: NewClubInput },
  ThunkApiType<RootState>
>(
  ClubActions.ADD_NEW_CLUB,
  async ({ input }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new ClubService(userAuth?.auth_token).addNewClub(input);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addNewClubLeader = createAsyncThunk<
  ClubLeader,
  NewClubLeaderInput,
  ThunkApiType<RootState>
>(
  ClubActions.ADD_NEW_CLUB_LEADER,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new ClubService(userAuth?.auth_token).addNewClubLeader(
          input
        );
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const changeClubName = createAsyncThunk<
  Club,
  MutationChangeClubNameArgs,
  ThunkApiType<RootState>
>(
  ClubActions.CHANGE_CLUB_NAME,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new ClubService(userAuth?.auth_token).changeClubName(
          input
        );
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateCoachAboutInfo = createAsyncThunk<
  Coach,
  MutationUpdateCoachAboutInfoArgs,
  ThunkApiType<RootState>
>(
  ClubActions.UPDATE_COACH_ABOUT_INFO,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new ClubService(userAuth?.auth_token).updateCoachAboutInfo(
          input
        );
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getActivityMeetRegularDetails = createAsyncThunk<
  ActivityMeetRegular,
  QueryActivityMeetRegularDetailsArgs,
  ThunkApiType<RootState>
>(
  ClubActions.GET_ACTIVITY_MEET_REGULAR_DETAILS,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new ClubService(
          userAuth?.auth_token
        ).getActivityMeetRegularDetails(input);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getActivityBeCreativeDetails = createAsyncThunk<
  ActivityBeCreative,
  QueryActivityBeCreativeDetailsArgs,
  ThunkApiType<RootState>
>(
  ClubActions.GET_ACTIVITY_BE_CREATIVE_DETAILS,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new ClubService(
          userAuth?.auth_token
        ).getActivityBeCreativeDetails(input);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
