import {
  CmsVisitDataInputModelInput,
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

export type PQAState = {
  coachPractitionersTimeline?: CoachPractitionerTimeline[];
  prePqaFormData?: FormData[];
  prePqaPreviousFormData?: PreviousFormData[];
  pqaFormData?: FormData[];
  supportVisitFormData?: FormData[];
};
