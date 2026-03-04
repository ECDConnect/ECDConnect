import { createSlice } from '@reduxjs/toolkit';
import { getConsent, getOpenConsent } from './consent.actions';
import { ContentConsentState } from './consent.types';
import localForage from 'localforage';
import { setFulfilledThunkActionStatus } from '@/store/utils';

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
      const locale = action.meta.arg.locale;
      if (action.payload) {
        state.consent = action.payload.map((consent) => ({
          ...consent,
          locale,
        }));
      }

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getOpenConsent.fulfilled, (state, action) => {
      const locale = action.meta.arg.locale;
      const payload = action.payload;

      if (!payload) {
        setFulfilledThunkActionStatus(state, action);
        return;
      }

      const dataRecord = payload[0];
      const newConsent = {
        ...dataRecord,
        locale,
      };

      if (!state.consent) {
        state.consent = [];
      }

      const existingIndex = state.consent.findIndex(
        (c) => c.id === newConsent.id && c.locale === locale
      );
      if (existingIndex === -1) {
        state.consent.push(newConsent);
      } else {
        state.consent[existingIndex] = newConsent;
      }
      setFulfilledThunkActionStatus(state, action);
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
