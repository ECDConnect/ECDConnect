import { RootState } from '../types';

export const getSyncStatus = (state: RootState): string => state.sync.status;
export const getCurrentSyncAction = (state: RootState): string =>
  state.sync.currentAction;
export const getSyncError = (state: RootState): string => state.sync.error;
