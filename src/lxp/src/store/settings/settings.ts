import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { format, formatISO } from 'date-fns';
import localForage from 'localforage';
import { getSettings } from './settings.actions';
import { SettingsState } from './settings.types';

const initialState: SettingsState = {
  childExpiryTime: 30,
  childProgressReportMonths: [6, 12],
  childInitialObservationPeriod: 30,
  lastDataSync: format(new Date(), 'MM/dd/yyyy hh:mm aa'),
  lastDataSyncUnformatted: formatISO(new Date()),
  notificationPollInterval: 1800000,
  applicationVersion: undefined,
  settings: undefined,
  loginDate: formatISO(new Date()),
};

const settingSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    resetSettingsState: (state) => {
      state.childExpiryTime = initialState.childExpiryTime;
      state.childProgressReportMonths = initialState.childProgressReportMonths;
      state.childInitialObservationPeriod =
        initialState.childInitialObservationPeriod;
      state.settings = initialState.settings;
    },
    setLastDataSync: (state) => {
      state.lastDataSync = format(new Date(), 'MM/dd/yyyy hh:mm aa');
      state.lastDataSyncUnformatted = formatISO(new Date());
    },
    setApplicationVersion: (state, action: PayloadAction<string>) => {
      state.applicationVersion = action.payload;
    },
    setLoginDate: (state) => {
      state.loginDate = formatISO(new Date());
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSettings.fulfilled, (state, action) => {
      if (action.payload && action.payload.Children) {
        state.childExpiryTime = +action.payload.Children.ChildExpiryTime;
        state.childInitialObservationPeriod =
          +action.payload.Children.ChildInitialObservationPeriod;
        state.childProgressReportMonths = [];
      }

      if (action.payload && action.payload.Reporting) {
        const months =
          action.payload.Reporting.ChildProgressReportMonths.split(',');
        months?.forEach((x) => {
          state.childProgressReportMonths.push(+x);
        });
      }
      if (action.payload) {
        state.settings = action.payload;
      }
    });
  },
});

const { reducer: settingReducer, actions: settingActions } = settingSlice;

const settingPersistConfig = {
  key: 'settings',
  storage: localForage,
  blacklist: [],
};

export { settingPersistConfig, settingReducer, settingActions };
