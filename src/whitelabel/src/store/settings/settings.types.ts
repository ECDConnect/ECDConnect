import { SettingTypeDto } from '@ecdlink/core';

export type SettingsState = {
  childExpiryTime: number;
  childProgressReportMonths: number[];
  childInitialObservationPeriod: number;
  lastDataSync: string;
  notificationPollInterval: number;
  applicationVersion?: string;
  settings?: SettingTypeDto;
};
