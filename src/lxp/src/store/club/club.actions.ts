import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import {
  ActivityBeCreative,
  ActivityHostFamilyDays,
  ActivityMeetRegular,
  Club,
  ClubLeader,
  ClubMember,
  Coach,
  MutationAcceptNewClubLeaderRoleArgs,
  MutationChangeClubNameArgs,
  MutationSaveWelcomeMessageArgs,
  MutationUpdateCoachAboutInfoArgs,
  NewClubInput,
  NewClubMemberInput,
  QueryActivityBeCreativeDetailsArgs,
  QueryActivityMeetRegularDetailsArgs,
  QueryClubForUserArgs,
} from '@ecdlink/graphql';
import { ClubService } from '@/services/ClubService';
import {
  BeCreativeActivityInput,
  ChangeClubSupportRoleInput,
  ClubMeetingInput,
  HostFamilyActivityInput,
  NewClubLeaderInput,
} from '@/services/ClubService/types';
import { DetailClubDto } from '@/models/club/club.dto';

export const ClubActions = {
  GET_CLUBS_FOR_COACH: 'getClubsForCoach',
  GET_CLUB_BY_ID: 'getClubById',
  GET_CLUBS_MEMBERS: 'getClubsMembers',
  ADD_NEW_CLUB: 'addNewClub',
  ADD_NEW_CLUB_LEADER: 'addNewClubLeader',
  ADD_NEW_CLUB_MEMBERS: 'addNewClubMembers',
  MOVE_CLUB_MEMBERS: 'moveClubMembers',
  CHANGE_CLUB_NAME: 'changeClubName',
  UPDATE_COACH_ABOUT_INFO: 'updateCoachAboutInfo',
  GET_ACTIVITY_MEET_REGULAR_DETAILS: 'getActivityMeetRegularDetails',
  GET_ACTIVITY_BE_CREATIVE_DETAILS: 'getActivityBeCreativeDetails',
  GET_ACTIVITY_HOST_FAMILY_DETAILS: 'getActivityHostFamilyDetails',
  GET_CLUB_FOR_USER: 'getClubForUser',
  SAVE_WELCOME_MESSAGE: 'saveWelcomeMessage',
  ACCEPT_NEW_CLUB_LEADER_ROLE: 'acceptNewClubLeaderRole',
  CHANGE_CLUB_SUPPORT_ROLE: 'changeClubSupportRole',
  ADD_CLUB_MEETING: 'addClubMeeting',
  ADD_BE_CREATIVE_ACTIVITY: 'addBeCreativeActivity',
  ADD_FAMILY_DAY_MEETING: 'addFamilyDayMeeting',
};

export const getClubById = createAsyncThunk<
  DetailClubDto,
  { clubId: string },
  ThunkApiType<RootState>
>(
  ClubActions.GET_CLUB_BY_ID,
  async ({ clubId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new ClubService(userAuth?.auth_token).getClubById(clubId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getClubsForCoach = createAsyncThunk<
  DetailClubDto[],
  { userId: string },
  ThunkApiType<RootState>
>(
  ClubActions.GET_CLUBS_FOR_COACH,
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new ClubService(userAuth?.auth_token).getClubsForCoach(
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

export const getActivityHostFamilyDetails = createAsyncThunk<
  ActivityHostFamilyDays,
  HostFamilyActivityInput,
  ThunkApiType<RootState>
>(
  ClubActions.GET_ACTIVITY_HOST_FAMILY_DETAILS,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new ClubService(
          userAuth?.auth_token
        ).getActivityHostFamilyDetails(input);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getClubForUser = createAsyncThunk<
  DetailClubDto,
  QueryClubForUserArgs,
  ThunkApiType<RootState>
>(
  ClubActions.GET_CLUB_FOR_USER,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new ClubService(userAuth?.auth_token).getClubForUser(
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

export const saveWelcomeMessage = createAsyncThunk<
  boolean,
  MutationSaveWelcomeMessageArgs,
  ThunkApiType<RootState>
>(
  ClubActions.SAVE_WELCOME_MESSAGE,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new ClubService(userAuth?.auth_token).saveWelcomeMessage(
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

export const acceptNewClubLeaderRole = createAsyncThunk<
  boolean,
  MutationAcceptNewClubLeaderRoleArgs,
  ThunkApiType<RootState>
>(
  ClubActions.ACCEPT_NEW_CLUB_LEADER_ROLE,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new ClubService(
          userAuth?.auth_token
        ).acceptNewClubLeaderRole(input);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const changeClubSupportRole = createAsyncThunk<
  // TODO: add type
  any,
  ChangeClubSupportRoleInput | undefined,
  ThunkApiType<RootState>
>(
  ClubActions.CHANGE_CLUB_SUPPORT_ROLE,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      clubs: { clubForPractitioner },
    } = getState();

    let payload = input as ChangeClubSupportRoleInput;

    if (!input?.clubId) {
      payload = {
        clubId: clubForPractitioner?.club?.id ?? '',
        practitionerId:
          clubForPractitioner?.club?.clubSupport?.practitionerId ?? '',
      } as ChangeClubSupportRoleInput;
    }

    if (!payload?.practitionerId) return;

    try {
      if (userAuth?.auth_token) {
        return await new ClubService(
          userAuth?.auth_token
        ).changeClubSupportRole(payload);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addClubMeeting = createAsyncThunk<
  // TODO: add type
  any,
  ClubMeetingInput | undefined,
  ThunkApiType<RootState>
>(
  ClubActions.ADD_CLUB_MEETING,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      clubs: { addClubMeetingSyncInputs },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        if (!!input?.meetingDate) {
          return await new ClubService(userAuth?.auth_token).addClubMeeting(
            input
          );
        }
        if (!input?.meetingDate && addClubMeetingSyncInputs?.length) {
          const promises = addClubMeetingSyncInputs.map((meeting) =>
            new ClubService(userAuth?.auth_token).addClubMeeting(meeting)
          );

          return await Promise.all(promises);
        }
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addBeCreativeActivity = createAsyncThunk<
  // TODO: add type
  any,
  BeCreativeActivityInput | undefined,
  ThunkApiType<RootState>
>(
  ClubActions.ADD_BE_CREATIVE_ACTIVITY,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      clubs: { addBeCreativeActivitySyncInputs },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        if (!!input?.dateUploaded) {
          return await new ClubService(
            userAuth?.auth_token
          ).addBeCreativeActivity(input);
        }
        if (!input?.dateUploaded && addBeCreativeActivitySyncInputs?.length) {
          const promises = addBeCreativeActivitySyncInputs.map((activity) =>
            new ClubService(userAuth?.auth_token).addBeCreativeActivity(
              activity
            )
          );

          return await Promise.all(promises);
        }
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addFamilyDayMeeting = createAsyncThunk<
  // TODO: add type
  any,
  ClubMeetingInput | undefined,
  ThunkApiType<RootState>
>(
  ClubActions.ADD_FAMILY_DAY_MEETING,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      clubs: { addFamilyDayMeetingSyncInputs },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        if (!!input?.meetingDate) {
          return await new ClubService(
            userAuth?.auth_token
          ).addFamilyDayMeeting(input);
        }
        if (!input?.meetingDate && addFamilyDayMeetingSyncInputs?.length) {
          const promises = addFamilyDayMeetingSyncInputs.map((activity) =>
            new ClubService(userAuth?.auth_token).addFamilyDayMeeting(activity)
          );

          return await Promise.all(promises);
        }
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
