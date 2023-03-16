import {
  CmsVisitDataInputModelInput,
  HealthPromotion,
  MoreInformation,
} from '@ecdlink/graphql';
import { VisitStatusDto } from '@ecdlink/core';
import { VisitVideosWithLocale } from './visit.actions';

export interface VisitState {
  visitStatus?: VisitStatusDto;
  visitFormData?: CmsVisitDataInputModelInput[];
  healthPromotion?: HealthPromotion[];
  moreInformation?: MoreInformation[];
  visitVideos?: VisitVideosWithLocale[];
}
