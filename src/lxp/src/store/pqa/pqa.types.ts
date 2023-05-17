import { PractitionerTimeLine } from '@ecdlink/graphql';

export interface CoachPractitionerTimeline {
  practitionerId: string;
  timeline: PractitionerTimeLine;
}

export type PQAState = {
  coachPractitionersTimeline?: CoachPractitionerTimeline[];
};
