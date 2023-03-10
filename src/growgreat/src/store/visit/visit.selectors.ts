import { HealthPromotionInput } from '@ecdlink/graphql';
import { VisitStatusDto } from '@ecdlink/core';
import { RootState } from '../types';

export const getVisitStatus = (state: RootState): VisitStatusDto | undefined =>
  state.visits.visitStatus;

export const getHealthPromotionSelector = (
  state: RootState
): HealthPromotionInput[] | undefined => state.visits.healthPromotion;
