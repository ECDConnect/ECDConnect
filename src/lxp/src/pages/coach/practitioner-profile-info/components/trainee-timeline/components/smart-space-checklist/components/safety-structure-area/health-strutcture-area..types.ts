export const yesNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];

export interface HealthSanitationSafetysProps {
  setSectionQuestions: any;
  setShowProgrammeDetails?: any;
  setVisitSection?: any;
  setActiveStep?: any;
  handleNextSection?: any;
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
