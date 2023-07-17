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

export const getTraineeVisitDataProgrammeName = (
  state: RootState
): string | null | undefined => {
  const visitData = state.trainee.traineeVisitData;
  const visitProgrammeName = visitData?.find(
    (item) => item?.question === 'What is the name of your programme?'
  );
  return visitProgrammeName?.questionAnswer;
};

export const getCoachSmartSpaceVisitData = (
  state: RootState
): VisitData[] | undefined => state.trainee.coachSmartSpaceCheckData;
