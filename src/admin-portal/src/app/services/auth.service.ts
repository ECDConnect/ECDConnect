import {
  APIs,
  LoginRequestModel,
  PasswordResetModel,
  RegisterRequestModel,
  SimpleUserModel,
} from '@ecdlink/core';
import { api } from '../utils/axios.helper';

const headers = { 'Content-Type': 'application/json' };

export async function AuthenticateUser(
  baseEndPoint: string,
  body: LoginRequestModel
) {
  return await api(baseEndPoint).post(APIs.authLogin, JSON.stringify(body), {
    headers: headers,
  });
}

export async function RefreshJwtToken(
  baseEndPoint: string,
  currentToken: string
) {
  return await api(baseEndPoint).get(`${APIs.refreshJwtToken}/${currentToken}`);
}

export async function UserForgotPassword(
  body: SimpleUserModel,
  baseEndPoint: string
) {
  return await api(baseEndPoint).post(
    APIs.forgotPassword,
    JSON.stringify(body),
    {
      headers: headers,
    }
  );
}

export async function ResetPasswordConfirmation(
  baseEndPoint: string,
  body: PasswordResetModel
) {
  return await api(baseEndPoint).post(
    APIs.confirmForgotPasswordReset,
    JSON.stringify(body),
    {
      headers: headers,
    }
  );
}

export async function RegisterNewUser(
  baseEndPoint: string,
  body: RegisterRequestModel
) {
  return await api(baseEndPoint).post(
    APIs.acceptAdminInvitation,
    JSON.stringify(body),
    {
      headers: headers,
    }
  );
}
