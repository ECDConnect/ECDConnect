import {
  ClassroomGroupDto,
  PractitionerColleagues,
  PractitionerDto,
  UserDto,
} from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PractitionerService } from '@services/PractitionerService';
import { RootState, ThunkApiType } from '../types';
import {
  MutationUpdatePractitionerRegisteredArgs,
  PractitionerInput,
  MutationUpdatePractitionerProgressArgs,
  MutationUpdatePractitionerUsePhotoInReportArgs,
  NotificationDisplay,
  PrincipalInvitationStatus,
  UserPermissionModel,
  PractitionerRemovalHistory,
  ClassroomGroupReassignmentsInput,
  MutationAddPractitionerToPrincipalArgs,
} from '@ecdlink/graphql';
import PermissionsService from '@/services/PermissionsService/PermissionsService';

export const PractitionerActions = {
  UPDATE_PRACTITIONER_REGISTERED: 'updatePractitionerRegistered',
  UPDATE_PRACTITIONER_PROGRESS: 'updatePractitionerProgress',
  DEACTIVATE_PRACTITIONER: 'deActivatePractitioner',
  UPDATE_PRACTITIONER_USEPHOTOINPROGRESS:
    'updatePractitionerUsePhotoInProgress',
  UPDATE_PRACTITIONER_BUSINESS_WALK_THROUGH:
    'updatePractitionerProgressWalkthrough',
  UPDATE_PRACTITIONER_PROGRESS_WALKTHROUGH:
    'updatePractitionerBusinessWalkThrough',
  UPDATE_PRACTITIONER_SHARE_INFO: 'updatePractitionerShareInfo',
  UPDATE_PRINCIPAL_INVITATION: 'updatePrincipalInvitation',
  UPDATE_PRACTITIONER_PERMISSIONS: 'updateUserPermission',
  UPDATE_PRACTITIONER_COMMUNITY_STATUS: 'updatePractitionerCommunityTabStatus',
  UPDATE_PRACTITIONER_CLICKED_ECD_HEROES: 'updatePractitionerClickedECDHeroes',
  CANCEL_REMOVE_PRACTITIONER_FROM_PROGRAMME:
    'cancelRemovePractitionerFromProgramme',
  UPDATE_REMOVE_PRACTITIONER_FROM_PROGRAMME:
    'updateRemovePractitionerFromProgramme',
  REMOVE_PRACTITIONER_FROM_PROGRAMME: 'removePractitionerFromProgramme',
  SEND_PRACTITIONER_INVITE_TO_APPLICATION:
    'sendPractitionerInviteToApplication',
  REMOVE_PRACTITIONER: 'removePractitioner',
  SWITCH_PRINCIPAL: 'switchPrincipal',
  SEND_PRACTITIONER_INVITE_TO_PRESCHOOL: 'sendPractitionerInviteToPreschool',
  ADD_PRACTITIONER_TO_PRINCIPAL: 'addPractitionerToPrincipal',
  SEND_PRACTITIONER_INVITE_TO_PRINCIPAL: 'sendPractitionerInvitePrincipal',
  PROMOTE_PRACTITIONER_TO_PRINCIPAL: 'promotePractitionerToPrincipal',
  GET_REMOVAL_FOR_PRACTITIONER: 'getRemovalForPractitioner',
  GET_PRACTITIONERS_DISPLAY_METRICS: 'getPractitionersDisplayMetrics',
  GET_PRACTITIONERS_FOR_COACH: 'getPractitionersForCoach',
  GET_ALL_PRACTITIONERS: 'getAllPractitioners',
  GET_ALL_PRACTITIONER_INVITES: 'getAllPractitionerInvites',
  GET_CLASSROOM_ACTIONS: 'getClassroomActionItems',
  GET_CLASSROOM_GROUP_CLASSROOM_FOR_PRACTITIONER:
    'getClassroomGroupClassroomsForPractitioner',
  GET_PRACTITIONER_COLLEAGUES: 'getPractitionerColleagues',
  GET_PRACTITIONER_BY_ID_NUMBER: 'getPractitionerByIdNumber',
  GET_REMOVALS_FOR_PRACTITIONERS: 'getRemovalsForPractitioners',
  GET_MOODLE_SESSION_FOR_CURRENT_USER: 'getMoodleSessionForCurrentUser',
};

export const getPractitionersForCoach = createAsyncThunk<
  PractitionerDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  PractitionerActions.GET_PRACTITIONERS_FOR_COACH,
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      practitioner: { practitioners: practitionersCache },
    } = getState();

    if (!practitionersCache) {
      try {
        let practitioners: PractitionerDto[] | undefined;

        if (userAuth?.auth_token) {
          practitioners = await new PractitionerService(
            userAuth?.auth_token
          ).getPractitionersForCoach(userAuth?.id);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        return practitioners;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return practitionersCache;
    }
  }
);

export const getPractitionerById = createAsyncThunk<
  PractitionerDto,
  { id: string },
  ThunkApiType<RootState>
>(
  'getPractitionerById',
  // eslint-disable-next-line no-empty-pattern
  async ({ id }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let practitioner: PractitionerDto | undefined;

      if (id === null || id.trim() === '') {
        return rejectWithValue('no practitioner id supplied');
      }

      if (userAuth?.auth_token) {
        practitioner = await new PractitionerService(
          userAuth?.auth_token
        ).getPractitionerById(id);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!practitioner) {
        return rejectWithValue('Error getting practitioner');
      }

      return practitioner;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getPractitionerByUserId = createAsyncThunk<
  PractitionerDto,
  { userId: string },
  ThunkApiType<RootState>
>(
  'getPractitionerByUserId',
  // eslint-disable-next-line no-empty-pattern
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let practitioner: PractitionerDto | undefined;

      if (userId === null || userId?.trim() === '') {
        return rejectWithValue('no user id supplied');
      }

      if (userAuth?.auth_token) {
        practitioner = await new PractitionerService(
          userAuth?.auth_token
        ).getPractitionerByUserId(userId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!practitioner) {
        return rejectWithValue('Error getting practitioner by user id');
      }

      return practitioner;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getPractitionerPermissions = createAsyncThunk<
  PractitionerDto,
  { userId: string },
  ThunkApiType<RootState>
>(
  'getPractitionerPermissions',
  // eslint-disable-next-line no-empty-pattern
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let practitioner: PractitionerDto | undefined;

      if (userId === null || userId?.trim() === '') {
        return rejectWithValue('no user id supplied');
      }

      if (userAuth?.auth_token) {
        practitioner = await new PractitionerService(
          userAuth?.auth_token
        ).getPractitionerPermissions(userId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!practitioner) {
        return rejectWithValue('Error getting practitioner by user id');
      }

      return practitioner;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAllPractitioners = createAsyncThunk<
  PractitionerDto[],
  {},
  ThunkApiType<RootState>
>(
  PractitionerActions.GET_ALL_PRACTITIONERS,
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let practitioners: PractitionerDto[] | undefined;

      if (userAuth?.auth_token) {
        practitioners = await new PractitionerService(
          userAuth?.auth_token
        ).getAllPractitioners();
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!practitioners) {
        return rejectWithValue('Error getting practitioner');
      }

      return practitioners;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getPractitionerDisplayMetrics = createAsyncThunk<
  NotificationDisplay[],
  { userType?: 'principal' | 'practitioner' | 'coach' },
  ThunkApiType<RootState>
>(
  PractitionerActions.GET_PRACTITIONERS_DISPLAY_METRICS,
  async ({ userType = 'principal' }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let practitionersMessageData: NotificationDisplay[] | undefined;

      if (userAuth?.auth_token) {
        practitionersMessageData = await new PractitionerService(
          userAuth?.auth_token!
        ).displayMetrics(userType);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!practitionersMessageData) {
        return rejectWithValue('Error getting practitioner display metrics');
      }

      return practitionersMessageData;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export type UpdatePractitionerRequest = {
  id: string;
  input: any;
};

export const updatePractitionerById = createAsyncThunk<
  any,
  UpdatePractitionerRequest,
  ThunkApiType<RootState>
>(
  'updatePractitionerById',
  // eslint-disable-next-line no-empty-pattern
  async ({ input, id }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      // let mappedCaregiverInput = mapPractitioner(input);

      if (userAuth?.auth_token) {
        await new PractitionerService(
          userAuth?.auth_token
        ).UpdatePractitionerByid(userAuth.id, input);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updatePractitioner = createAsyncThunk<
  any,
  PractitionerInput,
  ThunkApiType<RootState>
>(
  'updatePractitioner',
  // eslint-disable-next-line no-empty-pattern
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        await new PractitionerService(userAuth?.auth_token).updatePractitioner(
          input.Id,
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

export const updatePractitionerRegistered = createAsyncThunk<
  any,
  MutationUpdatePractitionerRegisteredArgs,
  ThunkApiType<RootState>
>(
  PractitionerActions.UPDATE_PRACTITIONER_REGISTERED,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    const id = input.practitionerId;

    try {
      if (userAuth?.auth_token && id) {
        await new PractitionerService(
          userAuth.auth_token
        ).UpdatePractitionerRegistered(id, input.status);
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updatePractitionerProgress = createAsyncThunk<
  any,
  MutationUpdatePractitionerProgressArgs,
  ThunkApiType<RootState>
>(
  PractitionerActions.UPDATE_PRACTITIONER_PROGRESS,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    const id = input.practitionerId;
    try {
      if (userAuth?.auth_token && id) {
        return await new PractitionerService(
          userAuth.auth_token
        ).UpdatePractitionerProgress(id, input.progress);
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updatePractitionerShareInfo = createAsyncThunk<
  any,
  { practitionerId: string },
  ThunkApiType<RootState>
>(
  PractitionerActions.UPDATE_PRACTITIONER_SHARE_INFO,
  async ({ practitionerId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (userAuth?.auth_token && practitionerId) {
        return await new PractitionerService(
          userAuth.auth_token
        ).UpdatePractitionerShareInfo(practitionerId);
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deActivatePractitioner = createAsyncThunk<
  boolean | undefined,
  {
    userId: string;
    reasonForPractitionerLeavingId: string;
    leavingComment?: string;
    reasonDetails?: string;
  },
  ThunkApiType<RootState>
>(
  PractitionerActions.DEACTIVATE_PRACTITIONER,
  async (
    { userId, leavingComment, reasonForPractitionerLeavingId, reasonDetails },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new PractitionerService(
          userAuth.auth_token
        ).deActivatePractitioner(
          userId,
          reasonForPractitionerLeavingId,
          leavingComment,
          reasonDetails
        );
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updatePractitionerUsePhotoInReport = createAsyncThunk<
  any,
  MutationUpdatePractitionerUsePhotoInReportArgs,
  ThunkApiType<RootState>
>(
  PractitionerActions.UPDATE_PRACTITIONER_USEPHOTOINPROGRESS,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    const id = input.practitionerId;
    try {
      if (userAuth?.auth_token && id) {
        return await new PractitionerService(
          userAuth.auth_token
        ).UpdatePractitionerUsePhotoInReport(id, input.usePhotoInReport || '');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updatePractitionerBusinessWalkThrough = createAsyncThunk<
  boolean | undefined,
  void,
  ThunkApiType<RootState>
>(
  PractitionerActions.UPDATE_PRACTITIONER_BUSINESS_WALK_THROUGH,
  async (_, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      practitioner: { practitioner: cache },
    } = getState();

    if (
      cache?.isCompletedBusinessWalkThrough === true ||
      cache?.syncedBusinessWalkThrough === true
    ) {
      return true;
    }

    try {
      if (userAuth?.auth_token) {
        return await new PractitionerService(
          userAuth.auth_token
        ).UpdatePractitionerBusinessWalkthrough();
      }
      return undefined;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updatePractitionerProgressWalkthrough = createAsyncThunk<
  boolean | undefined,
  void,
  ThunkApiType<RootState>
>(
  PractitionerActions.UPDATE_PRACTITIONER_PROGRESS_WALKTHROUGH,
  async (_, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      practitioner: { practitioner: cache },
    } = getState();

    if (
      cache?.progressWalkthroughComplete === true ||
      cache?.syncedProgressWalkThrough === true
    ) {
      return true;
    }

    try {
      if (userAuth?.auth_token) {
        return await new PractitionerService(
          userAuth.auth_token
        ).UpdatePractitionerProgressWalkthrough();
      }

      return undefined;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updatePrincipalInvitation = createAsyncThunk<
  PrincipalInvitationStatus | undefined,
  {
    userId: string;
    principalHierarchy: string;
    accepted: boolean;
  },
  ThunkApiType<RootState>
>(
  PractitionerActions.UPDATE_PRINCIPAL_INVITATION,
  async (
    { userId, principalHierarchy, accepted },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let result: PrincipalInvitationStatus | undefined;

      if (userAuth?.auth_token) {
        result = await new PractitionerService(
          userAuth?.auth_token || ''
        ).UpdatePrincipalInvitation(userId, principalHierarchy, accepted);
      }
      return result;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updatePractitionerPermissions = createAsyncThunk<
  UserPermissionModel[],
  {
    userId: string;
    permissionsIds: string[];
  },
  ThunkApiType<RootState>
>(
  PractitionerActions.UPDATE_PRACTITIONER_PERMISSIONS,
  async ({ userId, permissionsIds }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new PermissionsService(
          userAuth?.auth_token || ''
        ).UpdateUserPermission({
          userId: userId,
          permissionIds: permissionsIds,
        });
      }
      return rejectWithValue('No auth');
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updatePractitionerCommunityTabStatus = createAsyncThunk<
  any,
  { practitionerUserId: string },
  ThunkApiType<RootState>
>(
  PractitionerActions.UPDATE_PRACTITIONER_COMMUNITY_STATUS,
  async ({ practitionerUserId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token && practitionerUserId) {
        return await new PractitionerService(
          userAuth?.auth_token
        ).updatePractitionerCommunityTabStatus(practitionerUserId);
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateClickedECDHeros = createAsyncThunk<
  any,
  { userId: string },
  ThunkApiType<RootState>
>(
  PractitionerActions.UPDATE_PRACTITIONER_CLICKED_ECD_HEROES,
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token && userId) {
        return await new PractitionerService(
          userAuth?.auth_token
        ).updateClickedECDHeros(userId);
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getRemovalForPractitioner = createAsyncThunk<
  PractitionerRemovalHistory | undefined,
  { userId: string },
  ThunkApiType<RootState>
>(
  PractitionerActions.GET_REMOVAL_FOR_PRACTITIONER,
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    if (!userAuth?.auth_token) {
      return rejectWithValue('no access token, profile check required');
    }

    try {
      return await new PractitionerService(
        userAuth.auth_token
      ).getRemovalForPractitioner(userId);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to fetch practitioner removal history'
      );
    }
  }
);

export const cancelRemovePractitionerFromProgramme = createAsyncThunk<
  boolean,
  { existingRemovalId: string },
  ThunkApiType<RootState>
>(
  PractitionerActions.CANCEL_REMOVE_PRACTITIONER_FROM_PROGRAMME,
  async ({ existingRemovalId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    if (!userAuth?.auth_token) {
      return rejectWithValue('no access token, profile check required');
    }

    try {
      return await new PractitionerService(
        userAuth.auth_token
      ).cancelRemovePractitionerFromProgramme(existingRemovalId);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to cancel remove practitioner from programme'
      );
    }
  }
);

export const updateRemovePractitionerFromProgramme = createAsyncThunk<
  boolean,
  {
    removalId: string;
    reasonForPractitionerLeavingProgrammeId: string;
    reasonDetails: string | undefined;
    dateOfRemoval: Date;
    classroomGroupReassignments: ClassroomGroupReassignmentsInput[];
  },
  ThunkApiType<RootState>
>(
  PractitionerActions.UPDATE_REMOVE_PRACTITIONER_FROM_PROGRAMME,
  async (
    {
      removalId,
      reasonForPractitionerLeavingProgrammeId,
      reasonDetails,
      dateOfRemoval,
      classroomGroupReassignments,
    },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
    } = getState();

    if (!userAuth?.auth_token) {
      return rejectWithValue('no access token, profile check required');
    }

    try {
      return await new PractitionerService(
        userAuth.auth_token
      ).updateRemovePractitionerFromProgramme(
        removalId,
        reasonForPractitionerLeavingProgrammeId,
        reasonDetails,
        dateOfRemoval,
        classroomGroupReassignments
      );
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to update remove practitioner from programme'
      );
    }
  }
);

export const removePractitionerFromProgramme = createAsyncThunk<
  boolean,
  {
    practitionerUserId: string;
    reasonForPractitionerLeavingProgrammeId: string | undefined;
    reasonDetails: string | undefined;
    classroomId: string;
    dateOfRemoval: Date;
    classroomGroupReassignments: ClassroomGroupReassignmentsInput[];
  },
  ThunkApiType<RootState>
>(
  PractitionerActions.REMOVE_PRACTITIONER_FROM_PROGRAMME,
  async (
    {
      practitionerUserId,
      reasonForPractitionerLeavingProgrammeId,
      reasonDetails,
      classroomId,
      dateOfRemoval,
      classroomGroupReassignments,
    },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
    } = getState();

    if (!userAuth?.auth_token) {
      return rejectWithValue('no access token, profile check required');
    }

    try {
      return await new PractitionerService(
        userAuth.auth_token
      ).RemovePractitionerFromProgramme(
        practitionerUserId,
        reasonForPractitionerLeavingProgrammeId,
        reasonDetails,
        classroomId,
        dateOfRemoval,
        classroomGroupReassignments
      );
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to remove practitioner from programme'
      );
    }
  }
);

export const getAllPractitionerInvites = createAsyncThunk<
  Date[],
  { userId: string },
  ThunkApiType<RootState>
>(
  PractitionerActions.GET_ALL_PRACTITIONER_INVITES,
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      return await new PractitionerService(
        userAuth?.auth_token
      ).GetAllPractitionerInvites(userId);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to get all practitioner invites'
      );
    }
  }
);

export const sendPractitionerInviteToApplication = createAsyncThunk<
  string,
  { userId: string },
  ThunkApiType<RootState>
>(
  PractitionerActions.SEND_PRACTITIONER_INVITE_TO_APPLICATION,
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      return await new PractitionerService(
        userAuth?.auth_token
      ).SendPractitionerInviteToApplication(userId);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to send practitioner invite to application'
      );
    }
  }
);

export const getClassroomActionItems = createAsyncThunk<
  NotificationDisplay[],
  { userId: string },
  ThunkApiType<RootState>
>(
  PractitionerActions.GET_CLASSROOM_ACTIONS,
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      return await new PractitionerService(
        userAuth?.auth_token
      ).getClassroomActionItems(userId);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to get classroom action items'
      );
    }
  }
);

export const getClassroomGroupClassroomsForPractitioner = createAsyncThunk<
  ClassroomGroupDto[],
  { userId: string },
  ThunkApiType<RootState>
>(
  PractitionerActions.GET_CLASSROOM_ACTIONS,
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      return await new PractitionerService(
        userAuth?.auth_token
      ).getClassroomGroupClassroomsForPractitioner(userId);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to get Classroom Group Classrooms For Practitioner'
      );
    }
  }
);

export const getPractitionerColleagues = createAsyncThunk<
  PractitionerColleagues[],
  { userId: string },
  ThunkApiType<RootState>
>(
  PractitionerActions.GET_PRACTITIONER_COLLEAGUES,
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      return await new PractitionerService(
        userAuth?.auth_token
      ).getPractitionerColleagues(userId);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to get Classroom Group Classrooms For Practitioner'
      );
    }
  }
);

export const removePractitioner = createAsyncThunk<
  boolean,
  {
    practitionerUserId: string;
    reasonForPractitionerLeavingId: string | undefined;
    reasonDetails: string | undefined;
    newPrincipalId: string;
    classroomGroupReassignments: ClassroomGroupReassignmentsInput[];
  },
  ThunkApiType<RootState>
>(
  PractitionerActions.REMOVE_PRACTITIONER,
  async (
    {
      practitionerUserId,
      reasonForPractitionerLeavingId,
      reasonDetails,
      newPrincipalId,
      classroomGroupReassignments,
    },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
    } = getState();

    if (!userAuth?.auth_token) {
      return rejectWithValue('no access token, profile check required');
    }

    try {
      return await new PractitionerService(
        userAuth.auth_token
      ).RemovePractitioner(
        practitionerUserId,
        reasonForPractitionerLeavingId,
        reasonDetails,
        newPrincipalId,
        classroomGroupReassignments
      );
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to remove practitioner'
      );
    }
  }
);

export const getPractitionerByIdNumber = createAsyncThunk<
  UserDto,
  { idNumber: string },
  ThunkApiType<RootState>
>(
  PractitionerActions.GET_PRACTITIONER_BY_ID_NUMBER,
  async ({ idNumber }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      return await new PractitionerService(
        userAuth?.auth_token
      ).getPractitionerByIdNumber(idNumber);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to get Practitioner By IdNumber'
      );
    }
  }
);

export const getRemovalsForPractitioners = createAsyncThunk<
  PractitionerRemovalHistory[] | undefined,
  { userIds: string[] },
  ThunkApiType<RootState>
>(
  PractitionerActions.GET_REMOVALS_FOR_PRACTITIONERS,
  async ({ userIds }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      return await new PractitionerService(
        userAuth?.auth_token
      ).getRemovalsForPractitioners(userIds);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to get Removals For Practitioners'
      );
    }
  }
);

export const switchPrincipal = createAsyncThunk<
  boolean,
  { oldPrincipalUserId: string; newPrincipalUserId: string },
  ThunkApiType<RootState>
>(
  PractitionerActions.SWITCH_PRINCIPAL,
  async (
    { oldPrincipalUserId, newPrincipalUserId },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      return await new PractitionerService(
        userAuth?.auth_token
      ).switchPrincipal(oldPrincipalUserId, newPrincipalUserId);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to switch Principal'
      );
    }
  }
);

export const sendPractitionerInviteToPreschool = createAsyncThunk<
  boolean,
  {
    practitionerPhoneNumber: string;
    preSchoolNameCode: string;
    preSchoolName: string;
    principalUserId: string;
    idOrPassport?: string;
  },
  ThunkApiType<RootState>
>(
  PractitionerActions.SEND_PRACTITIONER_INVITE_TO_PRESCHOOL,
  async (
    {
      practitionerPhoneNumber,
      preSchoolNameCode,
      preSchoolName,
      principalUserId,
      idOrPassport,
    },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      return await new PractitionerService(
        userAuth?.auth_token
      ).sendPractitionerInviteToPreschool(
        practitionerPhoneNumber,
        preSchoolNameCode,
        preSchoolName,
        principalUserId,
        idOrPassport
      );
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to send Practitioner Invite To Preschool'
      );
    }
  }
);

export const addPractitionerToPrincipal = createAsyncThunk<
  UserDto,
  MutationAddPractitionerToPrincipalArgs,
  ThunkApiType<RootState>
>(
  PractitionerActions.ADD_PRACTITIONER_TO_PRINCIPAL,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      return await new PractitionerService(
        userAuth?.auth_token
      ).AddPractitionerToPrincipal(input);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to add Practitioner To Principal'
      );
    }
  }
);

export const sendPractitionerInvitePrincipal = createAsyncThunk<
  boolean,
  { principalPhoneNumber: string; practitionerUserId: string },
  ThunkApiType<RootState>
>(
  PractitionerActions.SEND_PRACTITIONER_INVITE_TO_PRINCIPAL,
  async (
    { principalPhoneNumber, practitionerUserId },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      return await new PractitionerService(
        userAuth?.auth_token
      ).sendPractitionerInvitePrincipal(
        principalPhoneNumber,
        practitionerUserId
      );
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to practitioner Invite Principal'
      );
    }
  }
);

export const promotePractitionerToPrincipal = createAsyncThunk<
  UserDto,
  { userId: string },
  ThunkApiType<RootState>
>(
  PractitionerActions.PROMOTE_PRACTITIONER_TO_PRINCIPAL,
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      return await new PractitionerService(
        userAuth?.auth_token
      ).PromotePractitionerToPrincipal(userId);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to promote Practitioner To Principal'
      );
    }
  }
);

export const getMoodleSessionForCurrentUser = createAsyncThunk<
  string,
  void,
  ThunkApiType<RootState>
>(
  PractitionerActions.GET_MOODLE_SESSION_FOR_CURRENT_USER,
  async (_, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      return await new PractitionerService(
        userAuth?.auth_token
      ).getMoodleSessionForCurrentUser();
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to get Moodle Session For Current User'
      );
    }
  }
);
