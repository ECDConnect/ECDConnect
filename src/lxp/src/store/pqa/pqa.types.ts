import {
  CmsVisitDataInputModelInput,
  PractitionerTimeLine,
} from '@ecdlink/graphql';

export interface CoachPractitionerTimeline {
  practitionerId: string;
  timeline: PractitionerTimeLine;
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
