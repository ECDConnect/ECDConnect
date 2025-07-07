import {
  DiscussionNotes,
  InitialObservations,
  ProgrammeDetails,
  ProgrammeObservations,
} from './pre-pqa-visits';
import { CoachingAndVisitOrCallStep } from './general-support-visit/coaching-visit-or-call';
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
  isToShowStep1,
  isStep11AnswerTrue,
  isToRemoveSmartStarter,
  isToShowStep17,
}: {
  isToShowStep1: boolean;
  isStep11AnswerTrue: boolean;
  isToRemoveSmartStarter: boolean;
  isToShowStep17: boolean;
}) => [
  ...(isToShowStep1 ? [Step1] : []),
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
  ...(isStep11AnswerTrue ? [Step12, Step13, Step14, Step15] : []),
  Step16,
  ...(isToShowStep17 ? [Step17] : []),
  ...(isToRemoveSmartStarter ? [] : [Step18, Step19]),
];

export const delicensingSteps = [Step1Delicensing, Step2Delicensing];

export const getReAccreditationSteps = ({
  isToShowStep1,
  isToShowStep16,
  isToRemoveSmartStarter,
  isBasicSmartSpaceStandardsCompleted,
}: {
  isToShowStep1: boolean;
  isToShowStep16: boolean;
  isToRemoveSmartStarter: boolean;
  isBasicSmartSpaceStandardsCompleted: boolean;
}) => [
  ...(isToShowStep1 ? [Step1ReAccreditation] : []),
  Step2ReAccreditation,
  Step3ReAccreditation,
  Step4ReAccreditation,
  Step5ReAccreditation,
  Step6ReAccreditation,
  Step7ReAccreditation,
  ...(isBasicSmartSpaceStandardsCompleted
    ? [
        Step8ReAccreditation,
        Step9ReAccreditation,
        Step10ReAccreditation,
        Step11ReAccreditation,
        Step12ReAccreditation,
        Step13ReAccreditation,
        Step14ReAccreditation,
        Step15ReAccreditation,
      ]
    : []),
  ...(isToShowStep16 ? [Step16ReAccreditation] : []),
  ...(isToRemoveSmartStarter ? [] : [Step17ReAccreditation]),
];
