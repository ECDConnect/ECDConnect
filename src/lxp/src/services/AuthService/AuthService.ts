import {
  AcceptInvitationModel,
  APIs,
  Config,
  LoginRequestModel,
  AuthUser,
  PasswordResetModel,
  SimpleUserModel,
  VerifyInvitationModel,
  RegisterRequestModel,
  CheckUsernamePhoneNumberModel,
  UpdateUsernameModel,
  AuthCodeModel,
  ResendAuthCodeModel,
  VerifyPrincipalInvitationModel,
} from '@ecdlink/core';
import { NewPasswordRequest } from '@models/auth/login/NewPasswordRequest';
import { PasswordResetRequestReceived } from '@models/auth/login/PasswordResetRequestReceived';
import { SignUpInviteVerify } from '@models/auth/sign-up/SignUpInviteVerify';
import { getDataResponse } from '@utils/common/data-response.utils';
import { api } from '../axios.helper';

const handlerError = (error: any) => {
  return error?.response;
};

const headers = { 'Content-Type': 'application/json' };

class AuthService {
  async login(
    baseEndPoint: string,
    body: LoginRequestModel
  ): Promise<AuthUser> {
    const apiInstance = api(baseEndPoint);
    const response = await apiInstance.post(
      APIs.authLogin,
      JSON.stringify(body),
      {
        headers: headers,
      }
    );

    if (response.status !== 200) {
      throw new Error('Login failed - Server connection error');
    }

    return response.data;
  }

  async VerifyInvitationRequest(
    verifyInvitationModel: VerifyInvitationModel
  ): Promise<SignUpInviteVerify> {
    const BASE_URL = Config.authApi;

    const response = await api(BASE_URL)
      .post(APIs.verifyInvitation, JSON.stringify(verifyInvitationModel))
      .catch(handlerError);

    const dataResponse = getDataResponse<boolean>(response);

    if (dataResponse.dataError) {
      return {
        verified: false,
        errorMessage: dataResponse.dataError.error,
        errorCode: dataResponse.dataError.errorCode,
      };
    }

    return {
      verified: true,
    };
  }

  async AcceptInvitationRequest(
    acceptInvitationModel: AcceptInvitationModel
  ): Promise<boolean> {
    const BASE_URL = Config.authApi;
    const response = await api(BASE_URL)
      .post(APIs.acceptInvitation, JSON.stringify(acceptInvitationModel))
      .catch(handlerError);

    const dataResponse = getDataResponse<boolean>(response);

    if (dataResponse.dataError) return false;

    return true;
  }

  async SendForgotPasswordRequest(
    simpleUserModel: SimpleUserModel
  ): Promise<PasswordResetRequestReceived> {
    const requestSentResponse = await api(Config.authApi)
      .post(APIs.forgotPassword, JSON.stringify(simpleUserModel))
      .catch(handlerError);

    const dataResponse =
      getDataResponse<PasswordResetRequestReceived>(requestSentResponse);

    if (dataResponse.dataError)
      return {
        errorMessage: dataResponse.dataError.error,
        valid: false,
      };

    return {
      phoneNumber: dataResponse.data?.phoneNumber,
      returnUrl: dataResponse.data?.returnUrl,
      valid: true,
    };
  }

  async SendNewPasswordRequest(
    newPasswordModel: PasswordResetModel
  ): Promise<NewPasswordRequest> {
    const requestSentResponse = await api(Config.authApi)
      .post(APIs.confirmForgotPasswordReset, JSON.stringify(newPasswordModel))
      .catch(handlerError);

    const dataResponse =
      getDataResponse<NewPasswordRequest>(requestSentResponse);

    if (dataResponse.dataError)
      return {
        errorMessage: dataResponse.dataError.error,
        valid: false,
      };

    return {
      valid: true,
    };
  }

  async SendAuthCode(username: string, token: string): Promise<boolean> {
    const BASE_URL = Config.authApi;
    const response = await api(BASE_URL).post(
      APIs.sendAuthCode,
      JSON.stringify({
        token,
        username,
      })
    );

    const dataResponse = getDataResponse<boolean>(response);

    if (dataResponse.dataError) return false;

    return true;
  }

  async RefreshToken(currentToken: string): Promise<AuthUser | undefined> {
    const BASE_URL = Config.authApi;

    const response = await api(BASE_URL)
      .get(`${APIs.refreshJwtToken}/${currentToken}`)
      .catch(handlerError);

    if (response.status !== 200) {
      throw new Error('Getting refresh token failed - Server connection error');
    }

    return response.data;
  }

  async RegisterPractitioner(baseEndPoint: string, body: RegisterRequestModel) {
    return await api(baseEndPoint).post(
      APIs.registerPractitioner,
      JSON.stringify(body),
      {
        headers: headers,
      }
    );
  }

  async RegisterOpenAccessUser(
    baseEndPoint: string,
    body: RegisterRequestModel
  ) {
    return await api(baseEndPoint).post(
      APIs.addOAPractitioner,
      JSON.stringify(body),
      {
        headers: headers,
      }
    );
  }

  async CheckUsernamePhoneNumber(
    baseEndPoint: string,
    body: CheckUsernamePhoneNumberModel
  ) {
    return await api(baseEndPoint).post(
      APIs.checkUsernamePhoneNumber,
      JSON.stringify(body),
      {
        headers: headers,
      }
    );
  }

  async UpdateUsername(baseEndPoint: string, body: UpdateUsernameModel) {
    return await api(baseEndPoint).post(
      APIs.updateUsernamePassword,
      JSON.stringify(body),
      {
        headers: headers,
      }
    );
  }

  async VerifyAuthCode(baseEndPoint: string, body: AuthCodeModel) {
    return await api(baseEndPoint).post(
      APIs.verifyOAWLAuthCode,
      JSON.stringify(body),
      {
        headers: headers,
      }
    );
  }

  async VerifyPrincipalToken(
    baseEndPoint: string,
    body: VerifyPrincipalInvitationModel
  ) {
    return await api(baseEndPoint).post(
      APIs.verifyPrincipalToken,
      JSON.stringify(body),
      {
        headers: headers,
      }
    );
  }

  async SendOAAuthCode(
    username: string,
    phoneNumber: string
  ): Promise<boolean> {
    const BASE_URL = Config.authApi;
    const response = await api(BASE_URL).post(
      APIs.sendOAWLAuthCode,
      JSON.stringify({
        username,
        phoneNumber,
      })
    );

    const dataResponse = getDataResponse<boolean>(response);

    if (dataResponse.dataError) return false;

    return true;
  }

  async VerifyOaAuthCodeStatus(
    baseEndPoint: string,
    body: CheckUsernamePhoneNumberModel
  ) {
    const response = await api(baseEndPoint).post(
      APIs.verifyOAWLAuthCodeStatus,
      JSON.stringify(body),
      {
        headers: headers,
      }
    );

    const dataResponse = getDataResponse<boolean>(response);

    if (dataResponse.dataError) return false;

    return dataResponse?.data;
  }

  async UpdateOaPractitioner(baseEndPoint: string, body: RegisterRequestModel) {
    const response = await api(baseEndPoint).post(
      APIs.updateOAPractitioner,
      JSON.stringify(body),
      {
        headers: headers,
      }
    );

    const dataResponse = getDataResponse<boolean>(response);

    if (dataResponse.dataError) return false;

    return dataResponse?.data;
  }
}

export default AuthService;
