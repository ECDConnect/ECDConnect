import {
  Config,
  LoginRequestModel,
  AuthUser,
  AuthCodeModel,
  VerifyPrincipalInvitationModel,
  CheckUsernamePhoneNumberModel,
} from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthService } from '@services/AuthService';
import type { AxiosError } from 'axios';
import { RootState, ThunkApiType } from '../types';

export const AuthActions = {
  LOGIN: 'login',
  REFRESH_TOKEN: 'refreshToken',
  VERIFY_AUTH_CODE: 'verifyAuthCode',
  SEND_OA_AUTH_CODE: 'sendOAAuthCode',
  SEND_NEW_INVITATION: 'sendNewInvitation',
  VERIFY_PRINCIPAL_TOKEN: 'verifyPrincipalToken',
  CHECK_USERNAME_PHONE_NUMBER: 'checkUsernamePhoneNumber',
  GET_LATEST_AUTH_CODE: 'getLatestAuthCode',
};

export const login = createAsyncThunk<
  AuthUser,
  LoginRequestModel,
  ThunkApiType<RootState>
>(AuthActions.LOGIN, async (body, { rejectWithValue }) => {
  try {
    return await new AuthService().login(Config.authApi, body);
  } catch (err) {
    if ((err as AxiosError).response?.data?.error) {
      return rejectWithValue((err as AxiosError).response?.data);
    }
    return rejectWithValue({
      message: (err as Error).message,
      error: (err as Error).message,
      statusCode: 600,
      lockedOut: false,
    });
  }
});

export const refreshToken = createAsyncThunk<
  AuthUser | undefined,
  any,
  ThunkApiType<RootState>
>(AuthActions.REFRESH_TOKEN, async (any, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
  } = getState();

  try {
    return userAuth
      ? await new AuthService().RefreshToken(userAuth.auth_token)
      : undefined;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const verifyAuthCode = createAsyncThunk<
  any,
  { baseEndPoint: string; body: AuthCodeModel },
  ThunkApiType<RootState>
>(
  AuthActions.VERIFY_AUTH_CODE,
  async ({ baseEndPoint, body }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      return await new AuthService().VerifyAuthCode(baseEndPoint, body);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to Verify Auth Code'
      );
    }
  }
);

export const sendOAAuthCode = createAsyncThunk<
  boolean,
  { username: string; phoneNumber: string },
  ThunkApiType<RootState>
>(
  AuthActions.SEND_OA_AUTH_CODE,
  async ({ username, phoneNumber }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      return await new AuthService().SendOAAuthCode(username, phoneNumber);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to Send OA Auth Code'
      );
    }
  }
);

// Testing aid: resolves to the latest OA sign-up auth code when the backend has
// exposure enabled (non-production only), otherwise undefined. Never gated on an
// auth token because it is used during sign-up before login.
export const getLatestAuthCode = createAsyncThunk<
  string | undefined,
  { phoneNumber: string },
  ThunkApiType<RootState>
>(
  AuthActions.GET_LATEST_AUTH_CODE,
  async ({ phoneNumber }, { rejectWithValue }) => {
    try {
      return await new AuthService().GetLatestAuthCode(phoneNumber);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to get latest auth code'
      );
    }
  }
);

export const sendNewInvitation = createAsyncThunk<
  boolean,
  { username: string; token: string },
  ThunkApiType<RootState>
>(
  AuthActions.SEND_NEW_INVITATION,
  async ({ username, token }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      return await new AuthService().SendNewInvitation(username, token);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to send New Invitation'
      );
    }
  }
);

export const verifyPrincipalToken = createAsyncThunk<
  any,
  { baseEndPoint: string; body: VerifyPrincipalInvitationModel },
  ThunkApiType<RootState>
>(
  AuthActions.VERIFY_PRINCIPAL_TOKEN,
  async ({ baseEndPoint, body }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }
      return await new AuthService().VerifyPrincipalToken(baseEndPoint, body);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to Verify Principal Token'
      );
    }
  }
);

export const checkUsernamePhoneNumber = createAsyncThunk<
  any,
  { body: CheckUsernamePhoneNumberModel },
  ThunkApiType<RootState>
>(
  AuthActions.VERIFY_PRINCIPAL_TOKEN,
  async ({ body }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }
      return await new AuthService().CheckUsernamePhoneNumber(body);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to check Username Phone Number'
      );
    }
  }
);
