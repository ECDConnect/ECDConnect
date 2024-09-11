import {
  APIs,
  AuthCodeModel,
  LoginRequestModel,
  PasswordResetModel,
  PortalConsentModel,
  RegisterRequestModel,
  SimpleUserModel,
  TenantModel,
  VerifyInvitationModel,
} from '@ecdlink/core';
import { api } from '../utils/axios.helper';
import { AxiosResponse } from 'axios';
import { SetupOrgModel } from '../schemas/setup-org';

export interface DataError {
  errorCode?: number;
  error: string;
}
export interface DataResponse<T> {
  data?: T;
  dataError?: DataError;
}

export declare const Config: {
  graphQlApi: string;
  authApi: string;
  themeUrl: string;
};

const handlerError = (error: any) => {
  return error?.response;
};

const headers = { 'Content-Type': 'application/json' };

enum HttpResponseCodes {
  success = 200,
  badRequest = 400,
  serviceError = 500,
}

export const getDataResponse = <T>(
  response: AxiosResponse<any>
): DataResponse<T> => {
  let dataResponse: DataResponse<T> = {};

  if (!response) {
    dataResponse.dataError = {
      error: 'Response was empty',
    };
    return dataResponse;
  }

  switch (response.status) {
    case HttpResponseCodes.success:
      dataResponse.data = response.data;
      break;
    case HttpResponseCodes.badRequest:
      dataResponse.dataError = response.data;
      break;
    case HttpResponseCodes.serviceError:
      dataResponse.dataError = {
        error: 'Ooops... we could not complete your request',
      };
      break;
    default:
      dataResponse.dataError = {
        error: 'Unhandleld Error code',
      };
  }

  return dataResponse;
};

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

export async function VerifyInvitationRequest(
  baseEndPoint: string,
  verifyInvitationModel: VerifyInvitationModel
) {
  const response = await api(baseEndPoint)
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

export async function VerifyCellPhoneNumber(
  baseEndPoint: string,
  body: AuthCodeModel
) {
  return await api(baseEndPoint).post(
    APIs.verifyCellPhoneNumber,
    JSON.stringify(body),
    {
      headers: headers,
    }
  );
}

export async function GetCurrentTenant(
  baseEndPoint: string
): Promise<TenantModel | null> {
  const response = await api(baseEndPoint)
    .get(APIs.tenantCurrent, {
      headers: headers,
    })
    .catch(handlerError);

  if (response.status < 300) return response.data;
  return null;
}

export async function ValidateNewTenant(baseEndPoint: string, body: string) {
  const response = await api(baseEndPoint)
    .post(APIs.validateNewTenant, JSON.stringify(body), {
      headers: headers,
    })
    .catch(handlerError);

  if (response.status < 300) return response.data;
  return null;
}

export async function AddTenantSetupInfo(baseEndPoint: string, body: string) {
  const response = await api(baseEndPoint)
    .post(APIs.addTenantSetupInfo, JSON.stringify(body), {
      headers: headers,
    })
    .catch(handlerError);

  if (response.status < 300) return response.data;
  return null;
}

export async function FetchAllLanguages(baseEndPoint: string, body: string) {
  const response = await api(baseEndPoint)
    .post(APIs.fetchAllLanguages, JSON.stringify(body), {
      headers: headers,
    })
    .catch(handlerError);

  if (response.status < 300) return response.data;
  return null;
}

export async function GetConsentForPortal(
  baseEndPoint: string,
  portalConsentModel: PortalConsentModel
) {
  const response = await api(baseEndPoint)
    .post(APIs.getConsentForPortal, JSON.stringify(portalConsentModel), {
      headers: headers,
    })
    .catch(handlerError);

  if (response.status < 300) return response.data;
  return null;
}
