import {
  DiscussionNotes,
  InitialObservations,
  ProgrammeDetails,
  ProgrammeObservations,
} from './pre-pqa-visits';
import { CoachingAndVisitOrCallStep } from './general-support-visit';

export const prePqaVisits = [
  ProgrammeDetails,
  InitialObservations,
  ProgrammeObservations,
  DiscussionNotes,
];

export const generalSupportVisit = [CoachingAndVisitOrCallStep];
