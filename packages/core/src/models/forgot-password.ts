export interface SimpleUserModel {
  email?: string;
  username?: string;
  idField?: string;
  preferId?: boolean;
  passportField?: string;
  phoneNumber?: string;
}

export interface PasswordResetModel {
  username: string;
  password: string;
  resetToken: string;
  isSouthAfricanCitizen?: boolean;
}
