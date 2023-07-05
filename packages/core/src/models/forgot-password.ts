export interface SimpleUserModel {
  email: string;
}

export interface PasswordResetModel {
  username: string;
  password: string;
  resetToken: string;
  isSouthAfricanCitizen?: boolean
}
