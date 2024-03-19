import { HealthCareWorkerDto, UserPointsAcitivtyDto } from '@ecdlink/core';
import { MoreInformation, TeamStandingModel } from '@ecdlink/graphql';

export interface HealthCareWorkerState {
  healthCareWorker?: HealthCareWorkerDto;
  points: {
    data: UserPointsAcitivtyDto[];
    infoPage?: {
      [locale: string]: {
        dateLoaded: string;
        data: MoreInformation[];
      };
    }[];
  };
  teamStanding?: TeamStandingModel;
}
