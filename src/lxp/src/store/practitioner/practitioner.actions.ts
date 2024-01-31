import { PractitionerDto } from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PractitionerService } from '@services/PractitionerService';
import { RootState, ThunkApiType } from '../types';
import {
  MutationUpdatePractitionerRegisteredArgs,
  PractitionerInput,
  MutationUpdatePractitionerProgressArgs,
  MutationUpdatePractitionerUsePhotoInReportArgs,
  MutationUpdatePractitionerShareInfoArgs,
  LicenseModelInput,
  NotificationDisplay,
  PractitionerRemovalHistory,
} from '@ecdlink/graphql';

export const PractitionerActions = {
  UPDATE_PRACTITIONER_REGISTERED: 'updatePractitionerRegistered',
  UPDATE_PRACTITIONER_PROGRESS: 'updatePractitionerProgress',
  DEACTIVATE_PRACTITIONER: 'deActivatePractitioner',
  DELICENSE_PRACTITIONER: 'delicensePractitioner',
  UPDATE_PRACTITIONER_USEPHOTOINPROGRESS:
    'updatePractitionerUsePhotoInProgress',
  GET_ALL_STATEMENTS_BALANCE_SHEET_FOR_PRACTITIONER:
    'getAllStatementsBalanceSheetForPractitioner',
  GET_ALL_EXPENSES_FOR_PRACTITIONER: 'getAllExpensesForPractitioner',
  GET_ALL_INCOME_FOR_PRACTITIONER: 'getAllIncomeForPractitioner',
  UPDATE_PRACTITIONER_BUSINESS_WALK_THROUGH:
    'updatePractitionerBusinessWalkThrough',
  UPDATE_PRACTITIONER_SHARE_INFO: 'updatePractitionerShareInfo',
};

export const getPractitionersForCoach = createAsyncThunk<
  PractitionerDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getPractitionersForCoach',
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

      if (userId === null || userId.trim() === '') {
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

export const getAllPractitioners = createAsyncThunk<
  PractitionerDto[],
  {},
  ThunkApiType<RootState>
>(
  'getAllPractitioners',
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
  {},
  ThunkApiType<RootState>
>(
  'getPractitionersDisplayMetrics',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let practitionersMessageData: NotificationDisplay[] | undefined;

      if (userAuth?.auth_token) {
        practitionersMessageData = await new PractitionerService(
          userAuth?.auth_token!
        ).displayMetrics('principal');
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
  MutationUpdatePractitionerShareInfoArgs,
  ThunkApiType<RootState>
>(
  PractitionerActions.UPDATE_PRACTITIONER_SHARE_INFO,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    const id = input.practitionerId;
    try {
      if (userAuth?.auth_token && id) {
        return await new PractitionerService(
          userAuth.auth_token
        ).UpdatePractitionerShareInfo(id);
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

export const delicensePractitioner = createAsyncThunk<
  boolean | undefined,
  LicenseModelInput,
  ThunkApiType<RootState>
>(
  PractitionerActions.DELICENSE_PRACTITIONER,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new PractitionerService(
          userAuth.auth_token
        ).delicensePractitioner(input);
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
  {
    userId: string;
  },
  ThunkApiType<RootState>
>(
  PractitionerActions.UPDATE_PRACTITIONER_BUSINESS_WALK_THROUGH,
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new PractitionerService(
          userAuth.auth_token
        ).UpdatePractitionerBusinessWalkthrough(userId);
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
