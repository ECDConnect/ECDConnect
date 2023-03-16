import { HealthPromotion, MoreInformation } from '@ecdlink/graphql';
import { VisitStatusDto } from '@ecdlink/core';
import { RootState } from '../types';

export const getVisitStatus = (state: RootState): VisitStatusDto | undefined =>
  state.visits.visitStatus;

export const getHealthPromotionSelector = (
  state: RootState
): HealthPromotion[] | undefined => state.visits.healthPromotion;

export const getMoreInformationSelector = (
  state: RootState
): MoreInformation[] | undefined => state.visits.moreInformation;
