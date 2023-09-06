import { createSelector } from 'reselect';
import { RootState } from '../types';
import { PointsUserSummary } from '@ecdlink/graphql';

export const getPointsSummary = createSelector(
  (state: RootState) => state.points.pointsSummary,
  (pointsSummary: PointsUserSummary[]) => pointsSummary
);
