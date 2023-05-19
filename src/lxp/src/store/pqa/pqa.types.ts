import {
  CmsVisitDataInputModelInput,
  PractitionerTimeline,
} from '@ecdlink/graphql';

export interface CoachPractitionerTimeline {
  practitionerId: string;
  timeline: PractitionerTimeline;
}

export interface FormData {
  practitionerId: string;
  formData: CmsVisitDataInputModelInput;
}

export type PQAState = {
  coachPractitionersTimeline?: CoachPractitionerTimeline[];
  prePqaFormData?: FormData[];
  pqaFormData?: FormData[];
};
