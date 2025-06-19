import { SettingTypeDto } from '@ecdlink/core';
import { RootState } from '../types';
import { addHours, addMinutes } from 'date-fns';

export const getChildExpiryTime = (state: RootState): number =>
  state.settings.childExpiryTime;

export const getChildProgressReportMonths = (state: RootState): number[] =>
  state.settings.childProgressReportMonths;

export const getChildInitialObservationPeriod = (state: RootState): number =>
  state.settings.childInitialObservationPeriod;

export const getLastDataSync = (state: RootState): string =>
  state.settings.lastDataSync;

export const getLasUnformattedDataSync = (state: RootState): string =>
  state.settings.lastDataSyncUnformatted;

export const getShouldUserSync = (state: RootState): boolean => {
  const lastSynced = new Date(state.settings.lastDataSync);
  const lastSyncedCutOffDateEpoch = new Date(lastSynced).setDate(
    lastSynced.getDate() + 30
  );
  return lastSyncedCutOffDateEpoch < new Date().valueOf();
};

export const getShouldUserSyncOnline = (state: RootState): boolean => {
  const lastLogin = new Date(state.settings.loginDate || new Date());
  const lastLoginCutOff = addHours(new Date(lastLogin), 18);
  //const lastLoginCutOff = addMinutes(new Date(lastLogin), 2);
  return lastLoginCutOff.getTime() < new Date().getTime();
};

export const getNotificationPollInterval = (state: RootState): number =>
  state.settings.notificationPollInterval;

export const getApplicationVersion = (state: RootState): string | undefined =>
  state.settings.applicationVersion;

export const getApplicationSettings = (
  state: RootState
): SettingTypeDto | undefined => state.settings.settings;
