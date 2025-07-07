import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { login, refreshToken } from './auth.actions';
import { LxpLoginReturnModel } from './auth.selectors';
import { AuthState } from './auth.types';

const initialState: AuthState = {
  userAuth: undefined,
  userExpired: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: () => initialState,
    setAuthUser: (state, action: PayloadAction<LxpLoginReturnModel>) => {
      state.userAuth = action.payload;
    },
    setUserExpired: (state) => {
      state.userExpired = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.userAuth = action.payload;
    });
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      if (action.payload) {
        state.userAuth = action.payload;
        state.userExpired = false;
      }
    });
    builder.addCase(refreshToken.rejected, (state, action) => {
      state.userExpired = true;
    });
  },
});

const authPersistConfig = {
  key: 'auth',
  storage: localForage,
  blacklist: [],
};

const { reducer: authReducer, actions: authActions } = authSlice;

export { authPersistConfig, authReducer, authActions };
