import {
  HealthPromotion,
  MoreInformation,
  Progress_VisitDataStatus,
  VisitData,
} from '@ecdlink/graphql';
import { VisitStatusDto } from '@ecdlink/core';
import { RootState } from '../types';
import { CompletedVisitsForVisitId } from './visit.types';

export const getVisitStatus = (state: RootState): VisitStatusDto | undefined =>
  state.visits.visitStatus;

export const getHealthPromotionSelector = (
  state: RootState
): HealthPromotion[] | undefined => state.visits.healthPromotion;

export const getMoreInformationSelector = (
  state: RootState
): MoreInformation[] | undefined => state.visits.moreInformation;

export const getCompletedVisitsByVisitIdSelector = (
  state: RootState,
  visitId: string
): CompletedVisitsForVisitId | undefined =>
  state.visits.completedVisitsForVisitId?.find(
    (item) => item.visitId === visitId
  );

export const getPreviousVisitInformationForInfantSelector = (
  state: RootState
): Progress_VisitDataStatus | undefined =>
  state.visits.previousVisitInformationForInfant;

export const getVisitVideoBySectionAndLocale = (
  state: RootState,
  section: string,
  locale: string
) =>
  state.visits.visitVideos?.find(
    (item) => item.section === section && item.locale === locale
  );

export const getGrowthDataForInfantSelector = (
  state: RootState
): VisitData[] | undefined => state.visits.growthDataForInfant;
