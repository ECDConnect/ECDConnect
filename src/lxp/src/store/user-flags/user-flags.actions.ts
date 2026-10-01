import { UserFlagDto } from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserFlagService } from '@/services/UserFlagService';
import { RootState, ThunkApiType } from '../types';

export const getUserFlags = createAsyncThunk<
  UserFlagDto[],
  void,
  ThunkApiType<RootState>
>('getUserFlags', async (_, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
  } = getState();

  if (!userAuth?.auth_token) {
    return rejectWithValue('no access token, profile check required');
  }

  try {
    return await new UserFlagService(userAuth.auth_token).getUserFlags();
  } catch (err) {
    return rejectWithValue(err);
  }
});

/**
 * Pushes every flag set on this device that has not reached the server.
 *
 * Runs as a step in the offline sync queue, so it must be safe to call when
 * there is nothing to do and when a flag was already pushed — setUserFlag
 * upserts, so replaying one is harmless.
 */
export const syncUserFlags = createAsyncThunk<
  string[],
  void,
  ThunkApiType<RootState>
>('syncUserFlags', async (_, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
    userFlags: { flags },
  } = getState();

  const unsynced = flags.filter((flag) => flag.synced === false);

  if (!unsynced.length) return [];

  if (!userAuth?.auth_token) {
    return rejectWithValue('no access token, profile check required');
  }

  try {
    const service = new UserFlagService(userAuth.auth_token);
    const pushed: string[] = [];

    for (const flag of unsynced) {
      await service.setUserFlag(flag.flagKey, flag.flagValue);
      pushed.push(flag.flagKey);
    }

    return pushed;
  } catch (err) {
    return rejectWithValue(err);
  }
});
