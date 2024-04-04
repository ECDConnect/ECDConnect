import {
  PointsLibrary,
  PointsUserSummary,
  UserClubStandingModel,
} from '@ecdlink/graphql';

export interface PointsState {
  pointsSummary: PointsUserSummary[];
  pointsLibrary: PointsLibrary[];
  // Since we are fetching this for the league tab, we can probably remove this
  userClubStanding:
    | {
        standing: UserClubStandingModel;
        dateLoaded: string;
      }
    | undefined;
}
