import { UserConsentDto, UserDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { getUser, getUserConsents, upsertUserConsents } from './user.actions';
import { UserState } from './user.types';

const initialState: UserState = {
  user: undefined,
  userLocalePreference: 'en-za', // DEFAULT IS ENGLISH
  userConsent: undefined,
  unstableConnection: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.unstableConnection = action.payload;
    },
    resetUserState: (state) => {
      state.user = initialState.user;
      state.userConsent = initialState.userConsent;
    },
    updateUser: (state, action: PayloadAction<UserDto>) => {
      if (state.user) {
        state.user = action.payload;
      }
    },
    createUserConsent: (state, action: PayloadAction<UserConsentDto>) => {
      if (!state.userConsent) state.userConsent = [];

      const existCheck = state.userConsent.some(
        (x) =>
          x.userId === action.payload.userId &&
          x.consentType === action.payload.consentType
      );

      const payloadUpdated = { ...action.payload, synced: false };

      if (!existCheck) state.userConsent?.push(payloadUpdated);
    },
    updateUserResetData: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.resetData = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });

    builder.addCase(getUserConsents.fulfilled, (state, action) => {
      state.userConsent = action.payload.map((consent) => ({
        ...consent,
        synced: true,
      }));
    });
    builder.addCase(upsertUserConsents.fulfilled, (state, action) => {
      state.userConsent = state.userConsent?.map((consent) => ({
        ...consent,
        synced: true,
      }));
    });
  },
});

const { reducer: userReducer, actions: userActions } = userSlice;

const userPersistConfig = {
  key: 'user',
  storage: localForage,
  blacklist: [],
};

export { userPersistConfig, userReducer, userActions };
