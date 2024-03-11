import { UserConsentDto, UserDto } from '@ecdlink/core';
import { UserConsentInput, UserModelInput } from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserService } from '@services/UserService';
import { RootState, ThunkApiType } from '../types';
import { UserResetPasswrodParams } from './user.types';

export const UserActions = {
  UPDATE_USER: 'updateUser',
};

export const getUser = createAsyncThunk<
  UserDto,
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>('getUser', async (_, { getState, rejectWithValue }) => {
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
});

export const getUserConsents = createAsyncThunk<
  UserConsentDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>('getUserConsents', async (_, { getState, rejectWithValue }) => {
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
});

export const upsertUserConsents = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>('upsertUserConsents', async (_, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
    user: { userConsent },
  } = getState();

  try {
    let promises: Promise<boolean>[] = [];

    if (userAuth?.auth_token && userConsent) {
      promises = userConsent.map(async (x) => {
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

export const updateUser = createAsyncThunk<
  boolean[],
  {},
  ThunkApiType<RootState>
>(UserActions.UPDATE_USER, async (_, { getState, rejectWithValue }) => {
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
});

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

const mapUser = (user: Partial<UserDto>): UserModelInput => ({
  isSouthAfricanCitizen: user.isSouthAfricanCitizen || false,
  idNumber: user.idNumber && user.idNumber.length > 0 ? user.idNumber : null,
  verifiedByHomeAffairs: user.verifiedByHomeAffairs || false,
  dateOfBirth: user.dateOfBirth,
  genderId: user.genderId && user.genderId.length > 0 ? user.genderId : null,
  raceId: user.raceId && user.raceId.length ? user.raceId : null,
  firstName: user.firstName,
  surname: user.surname,
  contactPreference: user.contactPreference,
  phoneNumber: user.phoneNumber,
  email: user.email,
  profileImageUrl: user.profileImageUrl,
  languageId: user.languageId,
});
