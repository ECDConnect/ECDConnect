import { ThunkActionStatuses } from '../types';

export type SyncStates = {
  status: ThunkActionStatuses;
  currentAction: string;
  error: string;
  currentStep: number;
  stepTotal: number;
};

export type SyncOfflineDataProps = {};

export type SyncOfflineDataReturnType = {};
