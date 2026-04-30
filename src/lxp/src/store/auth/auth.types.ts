import { LoginRequestModel } from '@ecdlink/core';
import { LxpLoginReturnModel } from './auth.selectors';

export type AuthState = {
  userAuth?: LxpLoginReturnModel;
  userExpired?: boolean;
  isAppLocked?: boolean;
};

export interface LoginSubmissionParams {
  body: LoginRequestModel;
}
