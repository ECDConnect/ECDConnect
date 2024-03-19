import { HealthCareWorkerDto, UserPointsAcitivtyDto } from '@ecdlink/core';
import { TeamStandingModel } from '@ecdlink/graphql';

export interface HealthCareWorkerState {
  healthCareWorker?: HealthCareWorkerDto;
  points: UserPointsAcitivtyDto[];
  teamStanding?: TeamStandingModel;
}
