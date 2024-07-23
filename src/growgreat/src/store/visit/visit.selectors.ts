import {
  ClientSummaryByPriority,
  DangerSign,
  HcwHighlights,
  HealthPromotion,
  Infographics,
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

export const getInfographicsSelector = (
  state: RootState
): Infographics[] | undefined => state.visits.infographics;

export const getDangerSignsSelector = (
  state: RootState
): DangerSign[] | undefined => state.visits.dangerSigns;

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
    (item) => item?.section === section && item?.locale === locale
  );

export const getGrowthDataForInfantSelector = (
  state: RootState
): VisitData[] | undefined => state.visits.growthDataForInfant;

export const getVisitAnswersForInfantSelector = (
  state: RootState
): VisitData[] | undefined => state.visits.visitAnswersForInfant;

export const getVisitAnswersForMotherSelector = (
  state: RootState
): VisitData[] | undefined => state.visits.visitAnswersForMother;

export const getHealthCareWorkerHighlightsSelector = (
  state: RootState
): HcwHighlights | undefined => state.visits.healthCareWorkerHighlights;

export const getPreviousVisitInformationForMotherSelector = (
  state: RootState
): Progress_VisitDataStatus | undefined =>
  state.visits.previousVisitInformationForMother;

export const getMomCompletedVisitsByVisitIdSelector = (
  state: RootState,
  visitId: string
): CompletedVisitsForVisitId | undefined =>
  state.visits.momcompletedVisitsForVisitId?.find(
    (item) => item.visitId === visitId
  );

export const GetMotherSummaryByPrioritySelector = (
  state: RootState
): ClientSummaryByPriority[] | undefined =>
  state.visits.motherSummaryByPriority;

export const GetInfantSummaryByPrioritySelector = (
  state: RootState
): ClientSummaryByPriority[] | undefined =>
  state.visits.infantSummaryByPriority;
