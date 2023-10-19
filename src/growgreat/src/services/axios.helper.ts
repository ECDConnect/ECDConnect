import { APIs, Config } from '@ecdlink/core';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
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

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse<any, any>) => {
      if (response.config.baseURL === Config.graphQlApi) {
        // checked for internal exception.
        if (response.data.errors === undefined) {
          console.log(
            `GRAPHQL: ${response.request.statusText}[${response.request.status}] `,
            {
              query: response.config.data,
              result: response.data,
            }
          );
        } else {
          (response as any).original_status = response.status;
          (response as any).original_statusText = response.statusText;
          response.status = 500;
          response.statusText =
            'Internal Server Error' +
            (response.data.errors?.length > 0 &&
            response.data.errors[0] &&
            response.data.errors[0].message
              ? ': ' + response.data.errors[0].message
              : '');
          console.error(
            `GRAPHQL: ${response.statusText}[${response.status}] `,
            {
              query: response.config.data,
              result: response.data,
            }
          );
        }
        if (response.status >= 400) {
          // temporary alert message - to be replaced with nicer UI.
          alert(
            'Error communicating with the server.\nSee the browser console for more details.'
          );
        }
        return response;
      }
    },
    (error: AxiosError) => {
      if (error.config.baseURL === Config.graphQlApi) {
        console.error(
          `GRAPHQL: ${error.request.statusText}[${error.request.status}] `,
          {
            query: error.config.data,
            result: error.response?.data,
          }
        );
        // temporary alert message - to be replaced with nicer UI.
        alert(
          'Error communicating with the server.\nSee the browser console for more details.'
        );
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

const blacklistCheckup = ($url: string, blacklist: string[]): boolean => {
  let returnValue = false;
  blacklist.forEach((i) => {
    if ($url.includes(i)) {
      returnValue = true;
    }
  });
  return returnValue;
};
