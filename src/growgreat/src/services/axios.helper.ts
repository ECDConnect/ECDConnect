import { APIs } from '@ecdlink/core';
import type { AxiosInstance } from 'axios';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { store } from '@store';
import { refreshToken } from '@store/auth/auth.actions';

export const api = (baseUrl: string, token?: string): AxiosInstance => {
  const blackList = [
    APIs.authLogin,
    APIs.refreshJwtToken,
    APIs.acceptInvitation,
    APIs.confirmForgotPasswordReset,
    APIs.forgotPassword,
    APIs.sendAuthCode,
    APIs.verifyInvitation,
  ];
  const headers: any = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers,
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      if (store && !blacklistCheckup(config.url ?? '', blackList)) {
        const user = store?.getState()?.auth?.userAuth;

        let currentDate = new Date();
        if (user?.auth_token) {
          const decodedToken: { exp: number } = jwt_decode(user?.auth_token);
          if (decodedToken.exp * 1000 < currentDate.getTime()) {
            await store.dispatch(refreshToken({}));
            if (config?.headers) {
              config.headers['authorization'] = `Bearer ${
                store?.getState()?.auth?.userAuth?.auth_token
              }`;
            }
          }
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

const blacklistCheckup = ($url: string, blacklist: string[]): boolean => {
  let returnValue = false;
  blacklist.forEach((i) => {
    if ($url.includes(i)) {
      return (returnValue = true);
    }
  });
  return returnValue;
};
