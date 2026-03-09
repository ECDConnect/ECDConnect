import { LoginType } from './login';

export interface AcceptInvitationModel {
  username: string;
  token: string;
  password: string;
  //verificationCode: string;
}

export interface VerifyInvitationModel {
  username: string;
  token: string;
  phoneNumber: string;
}

export interface VerifyCellphoneNumberModel {
  Username: string;
  Token: string;
}

export interface VerifySignupCellPhoneNumberModel {
  Cellphone: string;
  Token?: string;
  AuthCode?: string;
}

export interface VerifyPasswordTokenModel {
  Username: string;
  Token: string;
}

export interface AuthCodeModel {
  username: string;
  token: string;
}

export interface ResendAuthCodeModel {
  username: string;
}

export interface VerifyPrincipalInvitationModel {
  token: string;
}

export interface CheckUsernamePhoneNumberModel {
  username: string;
  phoneNumber?: string;
  userId?: string;
  googleToken?: string;
  facebookToken?: string;
}

export interface UpdateUsernameModel {
  userId: string;
  username?: string;
  password?: string;
  token?: string;
  shareInfo?: boolean;
  registerType?: LoginType;
}

export interface PortalConsentModel {
  locale: string;
  name: string;
}
