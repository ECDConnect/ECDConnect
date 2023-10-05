import { PractitionerDto } from '@ecdlink/core';
import { PointsUserSummary } from '@ecdlink/graphql';

export interface PractitionerForCoachState {
  practitionerForCoach?: PractitionerDto;
  practitionersForCoach?: PractitionerDto[];
  pointsForPractitionerUser: {
    [userId: string]: {
      dateLoaded: string;
      pointsSummaries: PointsUserSummary[];
    };
  };
}
