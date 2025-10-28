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

export interface AuthUser {
  auth_token: string;
  expires_in: string;
  id: string;
  resetData: boolean;
  userMustConfirmAuthCode: boolean;
  loginType: '' | 'google' | 'facebook';
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
  registerType?: string;
  shareInfoPartners?: boolean;
  googleToken?: string;
}
