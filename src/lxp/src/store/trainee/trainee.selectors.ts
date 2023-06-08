import { TraineeDto } from '@ecdlink/core';
import { RootState } from '../types';

export const getTrainee = (state: RootState): TraineeDto | undefined =>
  state.trainee.trainee;

export const getTraineeOnboardTimeline = (
  state: RootState
): TraineeDto | undefined => state.trainee.traineeOnboardTimeline;
