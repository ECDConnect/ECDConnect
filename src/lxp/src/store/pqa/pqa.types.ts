import {
  CmsVisitDataInputModelInput,
  Maybe,
  PqaRating,
  PractitionerTimeline,
  VisitData,
} from '@ecdlink/graphql';

export interface PractitionerTimelineState {
  practitionerId: string;
  timeline: PractitionerTimeline;
}

export interface FormData {
  practitionerId: string;
  formData: CmsVisitDataInputModelInput;
}

export interface PreviousFormData {
  visitId: string;
  formData: VisitData[];
}

export interface RatingData {
  rating?: Maybe<PqaRating>;
  visitNumber?: number;
}

export type PQAState = {
  coachPractitionersTimeline?: PractitionerTimelineState[];
  prePqaFormData?: FormData[];
  prePqaPreviousFormData?: PreviousFormData[];
  pqaPreviousFormData?: PreviousFormData[];
  reAccreditationPreviousFormData?: PreviousFormData[];
  supportVisitPreviousFormData?: PreviousFormData[];
  reAccreditationFollowUpVisitPreviousFormData?: PreviousFormData[];
  pqaFormData?: FormData[];
  reAccreditationFormData?: FormData[];
  supportVisitFormData?: FormData[];
  followUpVisitFormData?: FormData[];
  reAccreditationFollowUpVisitFormData?: FormData[];
  selfAssessmentFormData?: FormData[];
};

export type FollowUpType = 'pqa_visit_follow_up' | 're_accreditation_follow_up';

export type VisitType = 'pQASiteVisits' | 'reAccreditationVisits';

export type PQAStateKeys =
  | 'prePqaPreviousFormData'
  | 'reAccreditationFollowUpVisitPreviousFormData'
  | 'supportVisitPreviousFormData'
  | 'pqaPreviousFormData'
  | 'reAccreditationPreviousFormData';

export type PQAFormType =
  | 'pre-pqa'
  | 'pqa'
  | 'support-visit'
  | 'follow-up-visit'
  | 're-accreditation'
  | 're-accreditation-follow-up-visit'
  | 'self-assessment';
