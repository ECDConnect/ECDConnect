import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import jwt_decode from 'jwt-decode';
import {
  AuthCodeModel,
  AuthUser,
  Config,
  LocalStorageKeys,
  LoginRequestModel,
  PasswordResetModel,
  RegisterRequestModel,
  SimpleUserModel,
  VerifyInvitationModel,
} from '@ecdlink/core';
import {
  AuthenticateUser,
  RefreshJwtToken,
  UserForgotPassword,
  ResetPasswordConfirmation,
  RegisterNewUser,
  VerifyInvitationRequest,
  VerifyCellPhoneNumber,
} from '../services/auth.service';

export interface AuthContextType {
  authenticatedUser?: AuthUser;
  loading?: boolean;
  registerUser: (
    body: RegisterRequestModel,
    baseEndPoint: string
  ) => Promise<boolean>;
  login: (body: LoginRequestModel, baseEndPoint: string) => Promise<boolean>;

  verifyPhoneNumber: (
    baseEndPoint: string,
    body: VerifyInvitationModel
  ) => Promise<boolean | any>;

  verifyCellphoneNumber: (
    body: AuthCodeModel,
    baseEndPoint: string
  ) => Promise<boolean | any>;

  forgotPassword: (
    body: SimpleUserModel,
    baseEndPoint: string
  ) => Promise<boolean>;
  resetPassword: (
    body: PasswordResetModel,
    baseEndPoint: string
  ) => Promise<boolean>;
  logout: () => void;
  getAccessTokenPromise: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthUser>();

  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

  useEffect(() => {
    const user = localStorage.getItem(LocalStorageKeys.user);
    if (user) {
      setAuthenticatedUser(JSON.parse(user));
    }
    setLoadingInitial(false);
  }, []);

  const login = async (
    body: LoginRequestModel,
    baseEndPoint: string
  ): Promise<boolean> => {
    try {
      const response = await AuthenticateUser(baseEndPoint, body);

      if (response.data) {
        localStorage.setItem(
          LocalStorageKeys.user,
          JSON.stringify(response.data)
        );
        setAuthenticatedUser(response.data);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const registerUser = async (
    body: RegisterRequestModel,
    baseEndPoint: string
  ): Promise<boolean> => {
    try {
      const response = await RegisterNewUser(baseEndPoint, body);

      if (response.data) {
        localStorage.setItem(
          LocalStorageKeys.user,
          JSON.stringify(response.data)
        );
        setAuthenticatedUser(response.data);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const verifyPhoneNumber = async (
    baseEndPoint: string,
    body: VerifyInvitationModel
  ): Promise<boolean | any> => {
    try {
      const response = await VerifyInvitationRequest(baseEndPoint, body);

      if (response) {
        localStorage.setItem(LocalStorageKeys.user, JSON.stringify(response));
        return response;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const forgotPassword = async (
    body: SimpleUserModel,
    baseEndPoint: string
  ): Promise<boolean> => {
    try {
      const response = await UserForgotPassword(body, baseEndPoint);

      if (response) {
        localStorage.setItem(LocalStorageKeys.user, JSON.stringify(response));
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const resetPassword = async (
    body: PasswordResetModel,
    baseEndPoint: string
  ): Promise<boolean> => {
    try {
      const response = await ResetPasswordConfirmation(baseEndPoint, body);

      if (response) {
        localStorage.setItem(LocalStorageKeys.user, JSON.stringify(response));
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const getAccessTokenPromise = async (): Promise<string> => {
    const user = localStorage.getItem(LocalStorageKeys.user);
    const authUser: AuthUser = JSON.parse(user ?? '');
    const token = authUser && authUser.auth_token ? authUser.auth_token : '';

    if (isTokenExpired()) {
      const response = await refreshJwtToken(Config.authApi);
      handleAccessTokenRefresh(response);
      return new Promise((resolve) => resolve(response.auth_token));
    } else {
      return new Promise((resolve) => resolve(token));
    }
  };

  const refreshJwtToken = async (
    baseEndPoint: string
  ): Promise<AuthUser | undefined> => {
    try {
      const user = localStorage.getItem(LocalStorageKeys.user);
      const authUser: AuthUser = JSON.parse(user ?? '');
      const token = authUser && authUser.auth_token ? authUser.auth_token : '';
      const response = await RefreshJwtToken(baseEndPoint, token);
      return response && response.data ? response.data : undefined;
    } catch (err) {
      return undefined;
    }
  };

  const handleAccessTokenRefresh = (authUser: AuthUser) => {
    localStorage.setItem(LocalStorageKeys.user, JSON.stringify(authUser));
    setAuthenticatedUser(authUser);
  };

  const isTokenExpired = (): boolean => {
    try {
      const user = localStorage.getItem(LocalStorageKeys.user);

      if (user) {
        const authUser: AuthUser = JSON.parse(user);
        const decoded = jwt_decode(authUser.auth_token) as any;

        const today = new Date();

        return decoded?.exp <= today.valueOf() / 1000;
      }
      return true;
    } catch (err) {
      return true;
    }
  };

  const verifyCellphoneNumber = async (
    body: AuthCodeModel,
    baseEndPoint: string
  ): Promise<boolean> => {
    try {
      const response = await VerifyCellPhoneNumber(baseEndPoint, body);

      if (response) {
        localStorage.setItem(LocalStorageKeys.user, JSON.stringify(response));
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const logout = () => {
    setAuthenticatedUser(undefined);
    localStorage.removeItem(LocalStorageKeys.user);
  };

  // Make the provider update only when it should
  const memoedValue = useMemo(
    () => ({
      authenticatedUser,
      login,
      forgotPassword,
      resetPassword,
      registerUser,
      logout,
      getAccessTokenPromise,
      verifyPhoneNumber,
      verifyCellphoneNumber,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authenticatedUser]
  );

  return (
    <AuthContext.Provider value={memoedValue as AuthContextType}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
