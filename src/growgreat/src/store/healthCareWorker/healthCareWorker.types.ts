import {
  HealthCareWorkerDto,
  PointsTodoItemDto,
  UserPointsAcitivtyDto,
} from '@ecdlink/core';
import { MoreInformation, TeamStandingModel } from '@ecdlink/graphql';

export interface HealthCareWorkerState {
  healthCareWorker?: HealthCareWorkerDto;
  points: {
    completedItems?: UserPointsAcitivtyDto[];
    todoItems?: PointsTodoItemDto[];
    infoPage?: {
      [locale: string]: {
        dateLoaded: string;
        data: MoreInformation[];
      };
    }[];
  };
  teamStanding?: TeamStandingModel;
}
