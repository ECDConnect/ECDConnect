import { UserConsentDto, UserDto } from '@ecdlink/core';
import {
  UserConsentInput,
  UserModelInput,
  UserSyncStatus,
} from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserService } from '@services/UserService';
import { RootState, ThunkApiType } from '../types';
import { UserResetPasswrodParams } from './user.types';
import { newGuid } from '@/utils/common/uuid.utils';

export const getUser = createAsyncThunk<
  UserDto,
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getUser',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      user: { user: userCache },
    } = getState();

    if (!userCache) {
      try {
        let user: UserDto | undefined;

        if (userAuth?.auth_token) {
          user = await new UserService(userAuth?.auth_token).getUserById(
            userAuth.id
          );
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!user) {
          return rejectWithValue('Error getting User');
        }

        return user;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return userCache as UserDto;
    }
  }
);

export const getUserConsents = createAsyncThunk<
  UserConsentDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getUserConsents',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      user: { userConsent: userConsentCache },
    } = getState();

    if (!userConsentCache) {
      try {
        let userConsent: UserConsentDto[] | undefined;

        if (userAuth?.auth_token) {
          userConsent = await new UserService(
            userAuth?.auth_token
          ).getUserConsents(userAuth.id);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!userConsent) {
          return rejectWithValue('Error getting User Consent');
        }

        return userConsent;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return userConsentCache;
    }
  }
);

export const upsertUserConsents = createAsyncThunk<
  any,
  UserConsentDto,
  ThunkApiType<RootState>
>('upsertUserConsents', async (input, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
    user: { userConsent },
  } = getState();

  try {
    if (userAuth?.auth_token && input.id) {
      return await new UserService(userAuth?.auth_token).updateUserConsents(
        input.id,
        mapConsent(input)
      );
    }

    const unsyncedConsent = userConsent?.filter((consent) => !consent.synced);

    let promises: Promise<boolean>[] = [];

    if (userAuth?.auth_token && !!unsyncedConsent?.length) {
      promises = unsyncedConsent.map(async (x) => {
        const input: UserConsentInput = {
          Id: x.id,
          ConsentId: x.consentId,
          ConsentType: x.consentType,
          CreatedUserId: x.createdUserId,
          UserId: x.userId,
          IsActive: true,
        };

        return await new UserService(userAuth?.auth_token).updateUserConsents(
          x.id ?? '',
          input
        );
      });
    }
    return Promise.all(promises);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const resetUserPassword = createAsyncThunk<
  boolean,
  UserResetPasswrodParams,
  ThunkApiType<RootState>
>(
  'resetUserPassword',
  // eslint-disable-next-line no-empty-pattern
  async ({ newPassword }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let reset: boolean | undefined;

      if (userAuth?.auth_token) {
        reset = await new UserService(userAuth?.auth_token).resetUserPassword(
          userAuth.id,
          newPassword
        );
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!reset) {
        return rejectWithValue('Error reseting password');
      }

      return reset;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateUser = createAsyncThunk<any, {}, ThunkApiType<RootState>>(
  'updateUser',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      user: { user },
    } = getState();

    try {
      let update: boolean | undefined;

      if (userAuth?.auth_token && user) {
        const userModelInput: UserModelInput = mapUser(user);

        update = await new UserService(userAuth?.auth_token).updateUser(
          userAuth.id,
          userModelInput
        );
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!update) {
        return rejectWithValue('Error updating user');
      }

      return [update];
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getUserSyncStatus = createAsyncThunk<
  any,
  {},
  ThunkApiType<RootState>
>(
  'getUserSyncStatus',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      user: { user },
      settings: { lastDataSync },
      classroomData: { classroom },
    } = getState();

    try {
      let userSyncStatus: UserSyncStatus;

      if (userAuth?.auth_token && user) {
        userSyncStatus = await new UserService(
          userAuth?.auth_token
        ).getUserSyncStatus(
          userAuth.id,
          new Date(lastDataSync) || new Date(),
          classroom?.id || newGuid()
        );
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      return userSyncStatus;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

type AddUserRequest = {
  user: UserDto;
};

export const addUser = createAsyncThunk<
  UserDto,
  AddUserRequest,
  ThunkApiType<RootState>
>('addUser', async ({ user }, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
  } = getState();

  try {
    if (userAuth?.auth_token) {
      const userModelInput: UserModelInput = mapUser(user);

      return await new UserService(userAuth?.auth_token).addUser(
        userModelInput
      );
    } else {
      return rejectWithValue('no access token, profile check required');
    }
  } catch (err) {
    return rejectWithValue(err);
  }
});

const mapConsent = (userConsent: UserConsentDto): UserConsentInput => ({
  Id: userConsent.id,
  ConsentId: userConsent.consentId,
  ConsentType: userConsent.consentType,
  CreatedUserId: userConsent.createdUserId,
  UserId: userConsent.userId,
  IsActive: true,
});

const mapUser = (user: Partial<UserDto>): UserModelInput => ({
  isSouthAfricanCitizen: user.isSouthAfricanCitizen || false,
  idNumber: user.idNumber && user.idNumber.length > 0 ? user.idNumber : null,
  verifiedByHomeAffairs: user.verifiedByHomeAffairs || false,
  dateOfBirth: user.dateOfBirth,
  genderId: user.genderId ? user.genderId : null,
  raceId: user.raceId ? user.raceId : null,
  firstName: user.firstName,
  surname: user.surname,
  contactPreference: user.contactPreference,
  phoneNumber: user.phoneNumber,
  email: user.email,
  profileImageUrl: user.profileImageUrl,
  emergencyContactFirstName: user.emergencyContactFirstName
    ? user.emergencyContactFirstName
    : null,
  emergencyContactSurname: user.emergencyContactSurname
    ? user.emergencyContactSurname
    : null,
  emergencyContactPhoneNumber: user.emergencyContactPhoneNumber
    ? user.emergencyContactPhoneNumber
    : null,
  languageId:
    user.languageId && user.languageId.length ? user.languageId : null,
  whatsAppNumber: user.whatsappNumber ? user.whatsappNumber : null,
  resetData: user.resetData || false,
});
