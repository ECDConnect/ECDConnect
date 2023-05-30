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
  Step9,
  Step10,
  Step11,
  Step12FromYes,
  Step13,
  Step14,
  Step15,
} from './pqa-visits/first-pqa';

export const prePqaVisits = [
  ProgrammeDetails,
  InitialObservations,
  ProgrammeObservations,
  DiscussionNotes,
];

export const generalSupportVisit = [CoachingAndVisitOrCallStep];

export const getFirstPqaSteps = ({
  isStep11AnswerTrue,
}: {
  isStep11AnswerTrue: boolean;
}) => [
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6,
  Step7,
  Step8,
  Step9,
  Step10,
  Step11,
  ...(isStep11AnswerTrue ? [Step12FromYes, Step13, Step14] : []),
  Step15,
];
