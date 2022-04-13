import { RootState } from '../types';
import { AuthUser } from '@ecdlink/core';

export interface LxpLoginReturnModel extends AuthUser {
  isTempUser?: boolean;
}

export const getAuthUser = (
  state: RootState
): LxpLoginReturnModel | undefined => state.auth.userAuth;

export const getUserExpired = (state: RootState): boolean | undefined =>
  state.auth.userExpired;
