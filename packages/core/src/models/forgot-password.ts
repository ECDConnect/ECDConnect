export interface SimpleUserModel {
  username: string;
}

export interface PasswordResetModel {
  username: string;
  password: string;
  resetToken: string;
}
