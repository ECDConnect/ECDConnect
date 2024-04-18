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

export interface AuthCodeModel {
  username: string;
  token: string;
}
