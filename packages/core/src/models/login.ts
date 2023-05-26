export interface LoginRequestModel {
  username?: string;
  email?: string;
  phoneNumber?: string;
  password: string;
}

export interface AuthUser {
  auth_token: string;
  expires_in: string;
  id: string;
}

export interface RegisterRequestModel {
  email: string;
  password: string;
  acceptedTerms: boolean;
}

export interface ResetPasswordRequestModel {
  email: string;
}
