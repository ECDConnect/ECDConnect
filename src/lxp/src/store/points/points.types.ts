import {
  PointsLibrary,
  PointsUserSummary,
  UserClubStandingModel,
} from '@ecdlink/graphql';

export interface PointsState {
  pointsSummary: PointsUserSummary[];
  pointsLibrary: PointsLibrary[];
  userClubStanding:
    | {
        standing: UserClubStandingModel;
        dateLoaded: string;
      }
    | undefined;
}
