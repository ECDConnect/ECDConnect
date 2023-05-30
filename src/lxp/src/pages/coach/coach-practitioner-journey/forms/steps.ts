import {
  DiscussionNotes,
  InitialObservations,
  ProgrammeDetails,
  ProgrammeObservations,
} from './pre-pqa-visits';
import { CoachingAndVisitOrCallStep } from './general-support-visit';
import {
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6,
  Step7,
  Step8,
} from './pqa-visits/first-pqa';

export const prePqaVisits = [
  ProgrammeDetails,
  InitialObservations,
  ProgrammeObservations,
  DiscussionNotes,
];

export const generalSupportVisit = [CoachingAndVisitOrCallStep];

export const firstPqa = [
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6,
  Step7,
  Step8,
];
