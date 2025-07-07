import { DataError } from './DataError';

export interface DataResponse<T> {
  data?: T;
  dataError?: DataError;
}
