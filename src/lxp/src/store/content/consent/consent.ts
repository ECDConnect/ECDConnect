import { createSlice } from '@reduxjs/toolkit';
import { getConsent /* , getOpenConsent */ } from './consent.actions';
import { ContentConsentState } from './consent.types';
import localForage from 'localforage';

const initialState: ContentConsentState = {
  consent: undefined,
};

const contentConsentSlice = createSlice({
  name: 'contentConsent',
  initialState,
  reducers: {
    resetContentConsentState: (state) => {
      state.consent = initialState.consent;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getConsent.fulfilled, (state, action) => {
      state.consent = action.payload;
    });
  },
});

const { reducer: contentConsentReducer, actions: contentConsentActions } =
  contentConsentSlice;

const contentConsentPersistConfig = {
  key: 'contentConsent',
  storage: localForage,
  blacklist: [],
};

export {
  contentConsentPersistConfig,
  contentConsentReducer,
  contentConsentActions,
};
