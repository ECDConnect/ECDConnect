export interface LoginRequestModel {
  username: string;
  phoneNumber?: string;
  password: string;
}

export interface AuthUser {
  auth_token: string;
  expires_in: string;
  id: string;
}
