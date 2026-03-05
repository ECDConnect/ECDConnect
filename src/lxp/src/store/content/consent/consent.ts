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

      if (!action.payload || !Array.isArray(action.payload)) {
        setFulfilledThunkActionStatus(state, action);
        return;
      }

      state.consent = state.consent ?? [];

      action.payload.forEach((incoming) => {
        const index = state.consent!.findIndex(
          (item) => item.id === incoming.id && item.locale === locale
        );
        if (index === -1) {
          state.consent!.push({
            ...incoming,
            locale,
          });
        } else {
          state.consent![index] = {
            ...state.consent![index],
            ...incoming,
            locale,
          };
        }
      });

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getOpenConsent.fulfilled, (state, action) => {
      const locale = action.meta.arg.locale;
      const name = action.meta.arg.name;

      if (!action.payload || !Array.isArray(action.payload)) {
        setFulfilledThunkActionStatus(state, action);
        return;
      }

      state.consent = state.consent ?? [];

      action.payload.forEach((incoming) => {
        const index = state.consent!.findIndex(
          (item) => item.id === incoming.id && item.locale === locale
        );
        if (index === -1) {
          state.consent!.push({
            ...incoming,
            locale,
            name,
          });
        } else {
          state.consent![index] = {
            ...state.consent![index],
            ...incoming,
            locale,
            name,
          };
        }
      });
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
