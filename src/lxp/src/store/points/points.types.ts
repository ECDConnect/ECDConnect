import {
  PointsLibrary,
  PointsToDoItemModel,
  PointsUserDateSummary,
  PointsUserSummary,
  PointsUserYearMonthSummary,
} from '@ecdlink/graphql';

export interface PointsState {
  pointsSummary: PointsUserSummary[];
  pointsLibrary: PointsLibrary[];
  pointsToDo: PointsToDoItemModel | undefined;
  yearPoints: PointsUserYearMonthSummary | undefined;
  shareData: PointsUserDateSummary | undefined;
}
