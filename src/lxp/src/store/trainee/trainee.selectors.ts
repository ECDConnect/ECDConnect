import { TraineeDto } from '@ecdlink/core';
import { RootState } from '../types';
import { TraineeOnBoardTimeline, VisitData } from '@ecdlink/graphql';

export const getTrainee = (state: RootState): TraineeDto | undefined =>
  state.trainee.trainee;

export const getTraineeOnboardTimeline = (
  state: RootState
): TraineeOnBoardTimeline | undefined => state.trainee.traineeOnboardTimeline;

export const getTraineeVisitData = (
  state: RootState
): VisitData[] | undefined => state.trainee.traineeVisitData;
