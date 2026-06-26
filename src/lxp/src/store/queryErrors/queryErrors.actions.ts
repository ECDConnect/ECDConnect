import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState, ThunkApiType } from '../types';
import { api } from '@/services/axios.helper';
import { Config } from '@ecdlink/core';
const version = process.env.REACT_APP_VERSION ?? '';

export const upsertQueryErrors = createAsyncThunk<
  boolean,
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>('errors/upsertQueryErrors', async ({}, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
    queryErrors: { queryErrors },
  } = getState();

  if (!queryErrors || queryErrors.length === 0) {
    return true;
  }

  const errorsPayload = queryErrors.map((error) => ({
    id: error.id,
    type: error.type,
    message: error.message,
    eventDate: new Date(error.eventDate).toISOString(),
    payload: error.payload ? JSON.stringify(error.payload) : null,
    clientUrl: error.clientUrl,
    isOnline: error.isOnline,
    requestPayload: error.requestPayload
      ? typeof error.requestPayload === 'string'
        ? error.requestPayload
        : JSON.stringify(error.requestPayload)
      : null,
    userAgent: error.userAgent,
    appVersion: version,
  }));

  try {
    const accessToken = userAuth?.auth_token ?? '';
    const apiInstance = api(Config.authApi, accessToken);
    const response = await apiInstance.post('/api/applog', errorsPayload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data || 'Failed to send errors');
    }
    return rejectWithValue('Failed to send errors');
  }
});
