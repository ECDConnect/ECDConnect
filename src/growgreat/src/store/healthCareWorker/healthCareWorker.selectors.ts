import { HealthCareWorkerDto } from '@ecdlink/core';
import { RootState } from '../types';

export const getHealthCareWorker = (
  state: RootState
): HealthCareWorkerDto | undefined => state.healthCareWorker.healthCareWorker;
