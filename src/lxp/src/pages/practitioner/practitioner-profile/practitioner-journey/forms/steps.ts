import { PqaSummaryStep1 } from './pqa/step-1';
import { PrePqaSummaryStep1 } from './pre-pqa/step-1';
import { ReAccreditationSummaryStep1 } from './reaccreditation/step-1';
import { RequestCoachingVisitOrCall } from './request-coaching-visit-or-call';
import { Step1, Step2, Step3, Step4, Step5, Step6 } from './self-assessment';
import { SupportVisitStep1 } from './support-visit/step-1';

export const selfAssessmentSteps = [Step1, Step2, Step3, Step4, Step5, Step6];

export const supportVisitSteps = [SupportVisitStep1];

export const prePqaSteps = [PrePqaSummaryStep1];

export const pqaSteps = [PqaSummaryStep1];

export const reAccreditationSteps = [ReAccreditationSummaryStep1];

export const requestCoachingVisitOrCallSteps = [RequestCoachingVisitOrCall];
