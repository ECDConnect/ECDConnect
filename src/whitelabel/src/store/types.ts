import type { AppDispatch } from './config';
export type { RootState, AppDispatch } from './config';

export interface ThunkApiType<T> {
  // Optional fields for defining thunkApi field types
  dispatch: AppDispatch;
  state: T;
}

export enum ThunkActionStatuses {
  Unset = '',
  Fulfilled = 'fulfilled',
  Pending = 'pending',
  Rejected = 'rejected',
}
