import {
  CmsVisitDataInputModelInput,
  Maybe,
  PqaRating,
  PractitionerTimeline,
  VisitData,
} from '@ecdlink/graphql';

export interface CoachPractitionerTimeline {
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
  coachPractitionersTimeline?: CoachPractitionerTimeline[];
  prePqaFormData?: FormData[];
  prePqaPreviousFormData?: PreviousFormData[];
  reAccreditationFollowUpVisitPreviousFormData?: PreviousFormData[];
  pqaFormData?: FormData[];
  reAccreditationFormData?: FormData[];
  supportVisitFormData?: FormData[];
  followUpVisitFormData?: FormData[];
  reAccreditationFollowUpVisitFormData?: FormData[];
};

export type FollowUpType = 'pqa_visit_follow_up' | 're_accreditation_follow_up';

export type VisitType = 'pQASiteVisits' | 'reAccreditationVisits';

export type PQAStateKeys =
  | 'prePqaPreviousFormData'
  | 'reAccreditationFollowUpVisitPreviousFormData';
