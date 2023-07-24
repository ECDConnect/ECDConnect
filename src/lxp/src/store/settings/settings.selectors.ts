import { SettingTypeDto } from '@ecdlink/core';
import { RootState } from '../types';

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

export const getNotificationPollInterval = (state: RootState): number =>
  state.settings.notificationPollInterval;

export const getApplicationVersion = (state: RootState): string | undefined =>
  state.settings.applicationVersion;

export const getApplicationSettings = (
  state: RootState
): SettingTypeDto | undefined => state.settings.settings;
