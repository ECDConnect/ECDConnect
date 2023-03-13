import {
  CmsVisitDataInputModelInput,
  HealthPromotion,
  MoreInformation,
} from '@ecdlink/graphql';
import { VisitStatusDto } from '@ecdlink/core';

export interface VisitState {
  visitStatus?: VisitStatusDto;
  visitFormData?: CmsVisitDataInputModelInput;
  healthPromotion?: HealthPromotion[];
  moreInformation?: MoreInformation[];
}
