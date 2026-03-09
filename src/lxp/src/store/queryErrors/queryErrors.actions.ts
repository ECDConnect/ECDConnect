import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState, ThunkApiType } from '../types';
import { api } from '@/services/axios.helper';
import { Config } from '@ecdlink/core';

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
    details: JSON.stringify(error),
    eventDate: new Date(error.eventDate).toISOString(),
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
