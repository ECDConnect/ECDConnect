export interface LoginRequestModel {
  username?: string;
  email?: string;
  phoneNumber?: string;
  password: string;
  preferId?: boolean;
  passportField?: string;
  idField?: string;
  googleToken?: string;
  googleCode?: string;
}

export type LoginType = 'google' | 'facebook' | 'username';

export interface AuthUser {
  auth_token: string;
  expires_in: string;
  id: string;
  resetData: boolean;
  userMustConfirmAuthCode: boolean;
  loginType: LoginType;
  userName: string;
}

export interface RegisterRequestModel {
  username: string;
  password?: string;
  token?: string;
  acceptedTerms?: boolean;
  passportField?: string | undefined;
  idField?: string | undefined;
  preferId?: boolean | undefined;
  phoneNumber?: string;
  registerType?: LoginType;
  shareInfoPartners?: boolean;
  googleToken?: string;
}
