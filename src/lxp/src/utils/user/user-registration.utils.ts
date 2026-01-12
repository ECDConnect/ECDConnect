import { TenantContextType } from '@/hooks/useTenant';
import { AuthService } from '@/services/AuthService';
import {
  CheckUsernamePhoneNumberModel,
  LoginType,
  RegisterRequestModel,
  UpdateUsernameModel,
  VerifySignupCellPhoneNumberModel,
} from '@ecdlink/core';

export enum CreateUserResult {
  Success = 'SUCCESS',
  SuccessRegistered = 'SUCCESS_REGISTERED',
  SuccessRegisteredVerifyPhoneNumber = 'SUCCESS_REGISTERED_VERIFY_PHONENUMBER',
  SuccessLogin = 'SUCCESS_REDIRECT_LOGIN',
  UsernameExists = 'USERNAME_EXISTS',
  UsernameExistsLogin = 'USERNAME_EXISTS_LOGIN',
  UsernameInvalid = 'USERNAME_INVALID',
  FailedCreateUsername = 'FAILED_CREATE_USERNAME',
  RegistrationFailed = 'REGISTRATION_FAILED',
  PhoneNumberExists = 'PHONENUMBER_EXISTS',
}

export const validateUsername = (name: string): boolean =>
  /^[a-zA-Z0-9.@]+$/.test(name);

export const checkUsernamePhoneNumber = async (
  username: string,
  userId: string | undefined,
  googleToken: string | undefined,
  facebookToken: string | undefined
): Promise<CreateUserResult> => {
  const body: CheckUsernamePhoneNumberModel = {
    username: username,
    userId: userId,
    googleToken: googleToken,
    facebookToken: facebookToken,
  };
  const checkUsername = await new AuthService()
    .CheckUsernamePhoneNumber(body)
    .catch((error) => {
      return false;
    });
  if (checkUsername === false) return CreateUserResult.UsernameInvalid;
  if ((checkUsername as any)?.data?.statusCode === 4)
    return CreateUserResult.UsernameExists;
  if ((checkUsername as any)?.data?.statusCode === 3)
    return CreateUserResult.UsernameExistsLogin;
  if ((checkUsername as any)?.data?.statusCode === 1)
    return CreateUserResult.Success;
  return CreateUserResult.UsernameInvalid;
};

export const updateUsername = async (
  userId: string,
  username: string,
  password: string,
  token: string | undefined,
  shareInfo: boolean,
  registerType: LoginType
): Promise<boolean> => {
  const updateUserInputModel: UpdateUsernameModel = {
    userId,
    username,
    password,
    token,
    shareInfo,
    registerType,
  };

  const result = await new AuthService()
    .UpdateUsername(updateUserInputModel)
    .catch((error) => {
      return false;
    });

  return !!result;
};

export type UpdateOpenAccessPractitionerInfo = {
  username: string;
  password: string;
  phoneNumber: string;
  registerType: LoginType;
  shareInfoPartners: boolean | undefined;
  googleToken: string | undefined;
  facebookToken: string | undefined;
};

export const updateOpenAccessPractitioner = async (
  data: UpdateOpenAccessPractitionerInfo
): Promise<CreateUserResult> => {
  const {
    username,
    password,
    phoneNumber,
    registerType,
    shareInfoPartners,
    googleToken,
    facebookToken,
  } = data;

  const registerOpenAccessUserInput: RegisterRequestModel = {
    username,
    password,
    phoneNumber,
    registerType,
    shareInfoPartners,
    googleToken,
    facebookToken,
  };

  const userUpdated = await new AuthService()
    .UpdateOaPractitioner(registerOpenAccessUserInput)
    .catch((error) => {
      return CreateUserResult.PhoneNumberExists;
    });

  if (userUpdated === CreateUserResult.PhoneNumberExists)
    return CreateUserResult.PhoneNumberExists;

  if (userUpdated) return CreateUserResult.SuccessRegisteredVerifyPhoneNumber;

  return CreateUserResult.SuccessRegistered;
};

export const registerOpenAccessUser = async (
  username: string,
  password: string,
  phoneNumber: string,
  registerType: LoginType,
  shareInfoPartners: boolean | undefined,
  googleToken: string | undefined,
  facebookToken: string | undefined
): Promise<CreateUserResult> => {
  const registerOpenAccessUserInput: RegisterRequestModel = {
    username,
    password,
    phoneNumber,
    registerType,
    shareInfoPartners,
    googleToken,
    facebookToken,
  };

  const userCreated = await new AuthService()
    .RegisterOpenAccessUser(registerOpenAccessUserInput)
    .then(() => {
      return CreateUserResult.SuccessRegistered;
    })
    .catch((error) => {
      return CreateUserResult.FailedCreateUsername;
    });

  if (userCreated === CreateUserResult.FailedCreateUsername)
    return CreateUserResult.FailedCreateUsername;

  if (userCreated === CreateUserResult.SuccessRegistered)
    return CreateUserResult.SuccessLogin;

  return CreateUserResult.RegistrationFailed;
};

export type CreateUserInfo = {
  userId: string;
  username: string;
  password: string;
  phoneNumber: string;
  registerType: LoginType;
  shareInfoPartners: boolean | undefined;
  token: string | undefined;
  googleToken: string | undefined;
  facebookToken: string | undefined;
  tenant: TenantContextType;
};

export const createUser = async (
  data: CreateUserInfo
): Promise<CreateUserResult> => {
  const {
    userId,
    username,
    password,
    phoneNumber,
    registerType,
    shareInfoPartners,
    token,
    googleToken,
    facebookToken,
    tenant,
  } = data;

  if (tenant.isOpenAccess) {
    if (!validateUsername(username)) return CreateUserResult.UsernameInvalid;
  }

  const checkResult = await checkUsernamePhoneNumber(
    username,
    userId,
    googleToken,
    facebookToken
  );
  if (checkResult !== CreateUserResult.Success) return checkResult;

  if (tenant.isOpenAccess) {
    return await registerOpenAccessUser(
      username,
      password,
      phoneNumber,
      registerType,
      shareInfoPartners,
      googleToken,
      facebookToken
    );
  }

  if (
    await updateUsername(
      userId as any as string,
      username,
      password,
      token,
      shareInfoPartners ?? false,
      registerType
    )
  ) {
    return CreateUserResult.SuccessLogin;
  }

  return CreateUserResult.RegistrationFailed;
};

export const generateSignupCellPhoneNumberToken = async (
  cellphone: string
): Promise<string | undefined> => {
  const input: VerifySignupCellPhoneNumberModel = {
    Cellphone: cellphone,
  };
  const token = await new AuthService()
    .VerifySignupCellPhoneNumber(input)
    .catch((error) => {
      return undefined;
    });
  return token;
};

export const verifySignupCellPhoneNumberToken = async (
  cellphone: string,
  token: string,
  authCode: string
): Promise<boolean> => {
  const input: VerifySignupCellPhoneNumberModel = {
    Cellphone: cellphone,
    Token: token,
    AuthCode: authCode,
  };
  const result = await new AuthService()
    .VerifySignupCellPhoneNumber(input)
    .catch((error) => {
      return undefined;
    });
  return result !== undefined;
};
