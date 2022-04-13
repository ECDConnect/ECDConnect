import { ConsentDto } from '@ecdlink/core';
import { createSlice } from '@reduxjs/toolkit';
import { getConsent, getOpenConsent } from './consent.actions';
import { ContentConsentState } from './consent.types';

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

export { contentConsentReducer, contentConsentActions };
