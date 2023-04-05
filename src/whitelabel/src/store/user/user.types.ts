import { UserConsentDto, UserDto } from '@ecdlink/core';

export type UserState = {
  user: UserDto | undefined;
  userLocalePreference: string;
  userConsent: UserConsentDto[] | undefined;
};

export type UserResetPasswrodParams = {
  newPassword: string;
};
