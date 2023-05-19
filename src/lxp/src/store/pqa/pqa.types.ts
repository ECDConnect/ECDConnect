import {
  CmsVisitDataInputModelInput,
  PractitionerTimeLine,
  VisitData,
} from '@ecdlink/graphql';

export interface CoachPractitionerTimeline {
  practitionerId: string;
  timeline: PractitionerTimeLine;
}

export interface FormData {
  practitionerId: string;
  formData: CmsVisitDataInputModelInput;
}

export interface PreviousFormData {
  practitionerId: string;
  formData: VisitData[];
}

export type PQAState = {
  coachPractitionersTimeline?: CoachPractitionerTimeline[];
  prePqaFormData?: FormData[];
  prePqaPreviousFormData?: PreviousFormData[];
  pqaFormData?: FormData[];
};
