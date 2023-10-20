import { APIs, Config } from '@ecdlink/core';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { store } from '@store';
import { refreshToken } from '@store/auth/auth.actions';

const disableGraphqlErrorAlert =
  `${process.env.REACT_APP_DISABLE_GRAPHQL_ERROR_ALERT}` || '';
const disableGraphqlLogging =
  `${process.env.REACT_APP_DISABLE_GRAPHQL_LOGGING}` || '';

const logGraphQL = (
  logFunc: (message?: string, ...optionalParams: any[]) => void,
  statusText: any,
  status: any,
  query: any,
  result: any
) => {
  if (!!disableGraphqlLogging) return;
  logFunc(`GRAPHQL: ${statusText}[${status}] `, {
    query: query,
    result: result,
  });
};

const alertGraphQL = () => {
  // temporary alert message - to be replaced with nicer UI.
  if (!!disableGraphqlErrorAlert) return;
  alert(
    'Error communicating with the server.\nSee the browser console for more details.'
  );
};

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
          logGraphQL(
            console.log,
            response.request.statusText,
            response.request.status,
            response.config.data,
            response.data
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
          logGraphQL(
            console.error,
            response.statusText,
            response.status,
            response.config.data,
            response.data
          );
        }
        if (response.status >= 400) {
          alertGraphQL();
        }
      }
      return response;
    },
    (error: AxiosError) => {
      if (error.config.baseURL === Config.graphQlApi) {
        logGraphQL(
          console.error,
          error.request.statusText,
          error.request.status,
          error.config.data,
          error.response?.data
        );
        alertGraphQL();
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
