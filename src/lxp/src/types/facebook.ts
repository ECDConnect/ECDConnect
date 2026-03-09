export declare enum LoginStatus {
  CONNECTED = 'connected',
  AUTHORIZATION_EXPIRED = 'authorization_expired',
  NOT_AUTHORIZED = 'not_authorized',
  UNKNOWN = 'unknown',
}

export type AuthResponse = {
  userID: string;
  accessToken: string;
};

export type LoginResponse = {
  status: LoginStatus.CONNECTED;
  authResponse: AuthResponse;
};
