export interface SimpleUserModel {
  email?: string;
  username?: string;
}

export interface PasswordResetModel {
  username: string;
  password: string;
  resetToken: string;
  isSouthAfricanCitizen?: boolean;
}
