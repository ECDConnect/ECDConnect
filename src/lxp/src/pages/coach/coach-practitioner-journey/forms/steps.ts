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
  Step12,
  Step13,
  Step14,
  Step15,
  Step16,
  Step17,
  Step18,
  Step19,
} from './pqa-visits/first-pqa';
import { Step1Delicensing, Step2Delicensing } from './delicensing';
import {
  Step10ReAccreditation,
  Step11ReAccreditation,
  Step12ReAccreditation,
  Step13ReAccreditation,
  Step14ReAccreditation,
  Step15ReAccreditation,
  Step16ReAccreditation,
  Step17ReAccreditation,
  Step1ReAccreditation,
  Step2ReAccreditation,
  Step3ReAccreditation,
  Step4ReAccreditation,
  Step5ReAccreditation,
  Step6ReAccreditation,
  Step7ReAccreditation,
  Step8ReAccreditation,
  Step9ReAccreditation,
} from './reaccreditation';

export const prePqaVisits = [
  ProgrammeDetails,
  InitialObservations,
  ProgrammeObservations,
  DiscussionNotes,
];

export const generalSupportVisit = [CoachingAndVisitOrCallStep];

export const getFirstPqaSteps = ({
  isStep11AnswerTrue,
  isToRemoveSmartStarter,
}: {
  isStep11AnswerTrue: boolean;
  isToRemoveSmartStarter: boolean;
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
  ...(isStep11AnswerTrue ? [Step12, Step13, Step14] : []),
  Step15,
  Step16,
  Step17,
  ...(isToRemoveSmartStarter ? [] : [Step18, Step19]),
];

export const delicensingSteps = [Step1Delicensing, Step2Delicensing];

export const getReAccreditationSteps = ({
  isToRemoveSmartStarter,
}: {
  isToRemoveSmartStarter: boolean;
}) => [
  Step1ReAccreditation,
  Step2ReAccreditation,
  Step3ReAccreditation,
  Step4ReAccreditation,
  Step5ReAccreditation,
  Step6ReAccreditation,
  Step7ReAccreditation,
  Step8ReAccreditation,
  Step9ReAccreditation,
  Step10ReAccreditation,
  Step11ReAccreditation,
  Step12ReAccreditation,
  Step13ReAccreditation,
  Step14ReAccreditation,
  Step15ReAccreditation,
  Step16ReAccreditation,
  ...(isToRemoveSmartStarter ? [] : [Step17ReAccreditation]),
];
