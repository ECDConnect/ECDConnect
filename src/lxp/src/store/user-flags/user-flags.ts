import { UserFlagDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { UserFlagsState } from './user-flags.types';
import { getUserFlags, syncUserFlags } from './user-flags.actions';

const initialState: UserFlagsState = {
  flags: [],
};

const userFlagsSlice = createSlice({
  name: 'userFlags',
  initialState,
  reducers: {
    resetUserFlagsState: (state) => {
      state.flags = initialState.flags;
    },
    /**
     * Records a flag locally and marks it for pushing. Applied straight away
     * so the walkthrough it guards does not reappear while offline.
     */
    setFlag: (state, action: PayloadAction<UserFlagDto>) => {
      const existing = state.flags.find(
        (flag) => flag.flagKey === action.payload.flagKey
      );

      if (existing) {
        existing.flagValue = action.payload.flagValue;
        existing.synced = false;
        return;
      }

      state.flags.push({ ...action.payload, synced: false });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserFlags.fulfilled, (state, action) => {
      // Anything set on this device and not yet pushed outranks the server
      // copy, which does not know about it yet.
      const unsynced = state.flags.filter((flag) => flag.synced === false);

      state.flags = [
        ...action.payload
          .filter(
            (flag) =>
              !unsynced.some((pending) => pending.flagKey === flag.flagKey)
          )
          .map((flag) => ({ ...flag, synced: true })),
        ...unsynced,
      ];
    });

    builder.addCase(syncUserFlags.fulfilled, (state, action) => {
      action.payload.forEach((key) => {
        const flag = state.flags.find((item) => item.flagKey === key);
        if (flag) flag.synced = true;
      });
    });
  },
});

const { reducer: userFlagsReducer, actions: userFlagsActions } = userFlagsSlice;

const userFlagsPersistConfig = {
  key: 'userFlags',
  storage: localForage,
  blacklist: [],
};

export { userFlagsPersistConfig, userFlagsReducer, userFlagsActions };
