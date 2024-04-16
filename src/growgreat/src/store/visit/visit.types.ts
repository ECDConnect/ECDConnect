import {
  ClientSummaryByPriority,
  CmsVisitDataInputModelInput,
  HcwHighlights,
  HealthPromotion,
  Infographics,
  MoreInformation,
  Progress_VisitDataStatus,
  VisitData,
} from '@ecdlink/graphql';
import { VisitStatusDto } from '@ecdlink/core';
import { VisitVideosWithLocale } from './visit.actions';

export type CompletedVisitsForVisitId = {
  visitId: string;
  visits: string[];
};

export interface VisitState {
  visitStatus?: VisitStatusDto;
  visitFormData?: CmsVisitDataInputModelInput[];
  visitFormDataForMother?: CmsVisitDataInputModelInput[];
  healthPromotion?: HealthPromotion[];
  infographics?: Infographics[];
  moreInformation?: MoreInformation[];
  completedVisitsForVisitId?: CompletedVisitsForVisitId[];
  momcompletedVisitsForVisitId?: CompletedVisitsForVisitId[];
  previousVisitInformationForInfant?: Progress_VisitDataStatus;
  visitVideos?: VisitVideosWithLocale[];
  growthDataForInfant?: VisitData[];
  visitAnswersForInfant?: VisitData[];
  visitAnswersForMother?: VisitData[];
  healthCareWorkerHighlights?: HcwHighlights;
  previousVisitInformationForMother?: Progress_VisitDataStatus;
  motherSummaryByPriority?: ClientSummaryByPriority[];
  infantSummaryByPriority?: ClientSummaryByPriority[];
}
