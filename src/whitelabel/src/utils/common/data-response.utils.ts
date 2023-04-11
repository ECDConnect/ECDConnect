import { AxiosResponse } from 'axios';
import { DataResponse } from '@models/common/DataResponse';

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
