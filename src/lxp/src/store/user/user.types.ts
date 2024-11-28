import { OfflineUpdate } from '@/models/sync/offline-update';
import { UserConsentDto, UserDto } from '@ecdlink/core';

export type UserState = {
  user: UserDto | undefined;
  userLocalePreference: string;
  userConsent: (UserConsentDto & OfflineUpdate)[] | undefined;
  unstableConnection: boolean;
};

export type UserResetPasswrodParams = {
  newPassword: string;
};
