import { Config, LoginRequestModel, AuthUser } from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthService } from '@services/AuthService';
import type { AxiosError } from 'axios';
import { RootState, ThunkApiType } from '../types';

export const login = createAsyncThunk<
  AuthUser,
  LoginRequestModel,
  ThunkApiType<RootState>
>('auth/login', async (body, { rejectWithValue }) => {
  try {
    return await new AuthService().login(Config.authApi, body);
  } catch (err) {
    if ((err as AxiosError).response?.data?.error) {
      return rejectWithValue((err as AxiosError).response?.data?.error);
    }
    return rejectWithValue((err as Error).message);
  }
});

export const refreshToken = createAsyncThunk<
  AuthUser | undefined,
  any,
  ThunkApiType<RootState>
>('refreshToken', async (any, { getState, rejectWithValue }) => {
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
