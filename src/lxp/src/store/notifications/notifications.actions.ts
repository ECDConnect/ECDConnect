import { MutationDisableNotificationArgs } from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import NotificationAsyncService from '@/services/NotificationService/NotificationAsyncService';

export const NotificationActions = {
  DISABLE_NOTIFICATION: 'disableNotification',
};
export const disableNotification = createAsyncThunk<
  undefined,
  MutationDisableNotificationArgs,
  ThunkApiType<RootState>
>(
  NotificationActions.DISABLE_NOTIFICATION,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new NotificationAsyncService(
          userAuth?.auth_token
        ).disableNotification(input);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
