import { APIs, Config } from '@ecdlink/core';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { store } from '@store';
import { refreshToken } from '@store/auth/auth.actions';
import { userActions } from '@/store/user';
import { TIMEOUTS } from '@/constants/timeouts';
import { queryErrorsActions } from '@/store/queryErrors';
import { upsertQueryErrors } from '@/store/queryErrors/queryErrors.actions';

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
  // logFunc(`GRAPHQL: ${statusText}[${status}] `, { query, result });
};

const alertGraphQL = () => {
  if (!!disableGraphqlErrorAlert) return;
  window.dispatchEvent(new CustomEvent('graphql-error', {}));
};

const alertTimeout = () => {
  if (!!disableGraphqlErrorAlert) return;
  window.dispatchEvent(new CustomEvent('timeout-error', {}));
};

const updateConfigEndTime = (
  response: any,
  ignoreTimeoutCheck: boolean = false
) => {
  response.config.metadata.endTime = new Date();
  response.duration =
    response.config.metadata.endTime - response.config.metadata.startTime;

  const connectionType: string = (window.navigator as any).connection
    .effectiveType as string;

  const spottyConnectionTimeout =
    TIMEOUTS[connectionType]?.slowRequestTime || TIMEOUTS['4g'].slowRequestTime;

  if (response.duration >= spottyConnectionTimeout && !ignoreTimeoutCheck) {
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
  ];

  const headers: any = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const axiosInstance = axios.create({ baseURL: baseUrl, headers });

  const sanitizeValue = (value: any): any => {
    if (value instanceof Date) {
      return value.toISOString(); // Convert Date → string
    }
    if (Array.isArray(value)) {
      return value.map(sanitizeValue); // Deep clean arrays
    }
    if (value && typeof value === 'object') {
      const clean: any = {};
      for (const key in value) {
        clean[key] = sanitizeValue(value[key]);
      }
      return clean;
    }
    return value; // primitives are okay
  };

  const sanitizeConfig = (config: any) => ({
    url: config.url,
    method: config.method,
    headers: sanitizeValue(config.headers),
    params: sanitizeValue(config.params),
    data: sanitizeValue(config.data),
  });

  /**
   * REQUEST INTERCEPTOR
   */
  axiosInstance.interceptors.request.use(
    async (config: any) => {
      // ---- OFFLINE BLOCK ----
      if (!navigator.onLine) {
        // Create an Axios-like error to avoid undefined errors later
        return Promise.reject({
          isOffline: true,
          message: 'Browser is offline',
          config: sanitizeConfig(config),
          request: { status: 0, statusText: 'Offline' },
        });
      }

      // ---- JWT EXPIRED → REFRESH ----
      if (store && !blacklistCheckup(config.url ?? '', blackList)) {
        const user = store.getState()?.auth?.userAuth;

        if (user?.auth_token) {
          const decodedToken: { exp: number } = jwt_decode(user.auth_token);

          if (decodedToken.exp * 1000 < Date.now()) {
            await store.dispatch(refreshToken({}));

            if (config.headers) {
              config.headers.Authorization = `Bearer ${
                store.getState().auth.userAuth?.auth_token
              }`;
            }
          }
        }
      }

      config.metadata = { startTime: new Date() };
      return config;
    },
    (error) => Promise.reject(error)
  );

  /**
   * RESPONSE INTERCEPTOR
   */
  axiosInstance.interceptors.response.use(
    async (response: AxiosResponse | any) => {
      if (response.config.baseURL === Config.graphQlApi) {
        const hasInternalErrors = response.data.errors !== undefined;

        if (!hasInternalErrors) {
          logGraphQL(
            console.log,
            response.request?.statusText,
            response.request?.status,
            response.config.data,
            response.data
          );
        } else {
          response.original_status = response.status;
          response.original_statusText = response.statusText;

          response.status = 500;
          response.statusText =
            'Internal Server Error' +
            (response.data.errors?.length && response.data.errors[0]?.message
              ? `: ${response.data.errors[0].message}`
              : '');

          const user = store?.getState()?.auth?.userAuth;
          if (
            process.env.REACT_APP_SUPPRESS_ERROR_LOGGING === undefined ||
            process.env.REACT_APP_SUPPRESS_ERROR_LOGGING === '1'
          ) {
            for (let err of response.data.errors) {
              store.dispatch(
                queryErrorsActions.addError({
                  ...err,
                  timestamp: Date.now(),
                  eventDate: Date.now(),
                })
              );
            }
            await store.dispatch(upsertQueryErrors(user?.id || ''));
          }
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

    /**
     * ---- ERROR HANDLER ----
     */
    (error: AxiosError | any) => {
      // ---- Handle Offline Errors ----
      if (error.isOffline) {
        console.warn('Request skipped: offline.');
        return Promise.reject(error);
      }

      // ---- GraphQL Error Handling ----
      if (error.config?.baseURL === Config.graphQlApi) {
        const statusText = error.request?.statusText || 'Unknown Error';
        const status = error.request?.status || 0;

        logGraphQL(
          console.error,
          statusText,
          status,
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
  return blacklist.some((i) => $url.includes(i));
};
