import {
  CmsVisitDataInputModelInput,
  HealthPromotion,
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
  healthPromotion?: HealthPromotion[];
  moreInformation?: MoreInformation[];
  completedVisitsForVisitId?: CompletedVisitsForVisitId[];
  previousVisitInformationForInfant?: Progress_VisitDataStatus;
  visitVideos?: VisitVideosWithLocale[];
  visitAnswersForInfant?: VisitData[];
}
