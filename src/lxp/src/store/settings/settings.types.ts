import { SettingTypeDto } from '@ecdlink/core';

export type SettingsState = {
  childExpiryTime: number;
  childProgressReportMonths: number[];
  childInitialObservationPeriod: number;
  lastDataSync: string;
  lastDataSyncUnformatted: string;
  notificationPollInterval: number;
  applicationVersion?: string;
  settings?: SettingTypeDto;
  loginDate?: string;
};
