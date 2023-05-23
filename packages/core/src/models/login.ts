export interface LoginRequestModel {
  email: string;
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