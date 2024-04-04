import { UserConsentDto, UserDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { getUser, getUserConsents, updateUser } from './user.actions';
import { UserState } from './user.types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';

const initialState: UserState = {
  user: undefined,
  userLocalePreference: 'en-za', // DEFAULT IS ENGLISH
  userConsent: undefined,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
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

      if (!existCheck) state.userConsent?.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, updateUser);
    builder.addCase(updateUser.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(getUserConsents.fulfilled, (state, action) => {
      state.userConsent = action.payload;
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
