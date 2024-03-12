export enum SmartSpaceChecklistStepsSteps {
  INITIAL = 1,
  PROGRAMME_DETAILS = 2,
  HEALTH_SANITATION_SAFETY = 3,
  SAFETY_STRUCTURE_AREA = 4,
  SPACE_EMERGENCY_PLANNING = 5,
}

export interface SmartSpaceChecklistProps {
  checklistVisitId: string;
  setSectionQuestions: (value: SectionQuestions[]) => void;
  setVisitSection: (value: string) => void;
  setActiveStep: (value: SmartSpaceChecklistStepsSteps) => void;
  onSubmitAndContinue: () => void;
  onSubmit: () => void;
}

export interface Question {
  question: string;
  answer:
    | string
    | string[]
    | boolean
    | boolean[]
    | (string | number | undefined)[]
    | undefined;
}

export interface SectionQuestions {
  visitSection: string;
  questions: Question[];
}
