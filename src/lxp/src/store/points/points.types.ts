import { PointsLibrary, PointsUserSummary } from '@ecdlink/graphql';

export interface PointsState {
  pointsSummary: PointsUserSummary[];
  pointsLibrary: PointsLibrary[];
}
