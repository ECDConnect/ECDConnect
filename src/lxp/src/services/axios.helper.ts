import { APIs, Config } from '@ecdlink/core';
import type {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
} from 'axios';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { store } from '@store';
import { refreshToken } from '@store/auth/auth.actions';
import { userActions } from '@/store/user';
import { TIMEOUTS } from '@/constants/timeouts';

const disableGraphqlErrorAlert =
  process.env.REACT_APP_DISABLE_GRAPHQL_ERROR_ALERT;
const disableGraphqlLogging = process.env.REACT_APP_DISABLE_GRAPHQL_LOGGING;

const logGraphQL = (
  logFunc: (message?: string, ...optionalParams: any[]) => void,
  statusText: any,
  status: any,
  query: any,
  result: any
) => {
  if (!!disableGraphqlLogging) return;
  // logFunc(`GRAPHQL: ${statusText}[${status}] `, {
  //   query: query,
  //   result: result,
  // });
};

const alertGraphQL = () => {
  if (!!disableGraphqlErrorAlert) return;
  window.dispatchEvent(new CustomEvent('graphql-error', {})); // AppErrorHandler listens for the event.
};

const alertTimeout = () => {
  if (!!disableGraphqlErrorAlert) return;
  window.dispatchEvent(new CustomEvent('timeout-error', {})); // AppErrorHandler listens for the event.
};

/**
 * Checks the response time duration and updates the store if the connection is considered to be unreliable.
 *
 * @param {*} response
 * @param {boolean} [ignoreTimeoutCheck=false]
 */
const updateConfigEndTime = (
  response: any,
  ignoreTimeoutCheck: boolean = false
) => {
  if (!response.config || !response.config.metadata) return; // might be undefined if offline

  response.config.metadata.endTime = new Date();
  response.duration =
    response.config.metadata.endTime - response.config.metadata.startTime;

  // Ensure compatibility with all browsers
  const connection = (window.navigator as any).connection;
  const connectionType: string = connection?.effectiveType || '4g';

  // Ensure timeout exists to avoid undefined errors
  const issueTimeout = TIMEOUTS[connectionType]?.loadIssueTime || 5000; // Default 5s timeout if missing

  if (response.duration >= issueTimeout && !ignoreTimeoutCheck) {
    if (store.getState().user.unstableConnection === false) {
      store.dispatch(userActions.updateConnectionStatus(true));
    }
  }
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
    APIs.tenantCurrent,
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
    async (config: AxiosRequestConfig) => {
      if (!navigator.onLine) {
        return Promise.resolve({
          data: null,
          status: 0,
          statusText: 'Browser is offline',
          headers: {},
          config,
        });
      }

      if (store && !blacklistCheckup(config.url ?? '', blackList)) {
        const user = store?.getState()?.auth?.userAuth;

        let currentDate = new Date();
        if (user?.auth_token) {
          const decodedToken: { exp: number } = jwt_decode(user?.auth_token);
          if (decodedToken.exp * 1000 < currentDate.getTime()) {
            await store.dispatch(refreshToken({}));
            if (config?.headers) {
              config.headers['Authorization'] = `Bearer ${
                store?.getState()?.auth?.userAuth?.auth_token
              }`;
            }
          }
        }
      }

      (config as any).metadata = { startTime: new Date() };
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse<any, any> | any) => {
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
          if (response.status === 408 || response.status === 504) {
            alertTimeout();
          } else {
            alertGraphQL();
          }
        }
      }

      updateConfigEndTime(response, response.method === 'post');
      return response;
    },
    (error: AxiosError | any) => {
      if (!!error.config && error.config.baseURL === Config.graphQlApi) {
        logGraphQL(
          console.error,
          error.request.statusText,
          error.request.status,
          error.config.data,
          error.response?.data
        );
        if (error.message === 'Network Error') {
          alertTimeout();
        } else {
          alertGraphQL();
        }
      }
      updateConfigEndTime(error, true);
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
