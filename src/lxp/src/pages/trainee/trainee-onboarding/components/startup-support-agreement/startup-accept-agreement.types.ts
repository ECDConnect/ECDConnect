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

export enum StartupAgreementSteps {
  STARTUP_ACCEPT_AGREEMENT1 = 0,
  STARTUP_ACCEPT_AGREEMENT2 = 1,
  STARTUP_ACCEPT_AGREEMENT3 = 2,
  STARTUP_ACCEPT_AGREEMENT4 = 3,
  STARTUP_ACCEPT_AGREEMENT5 = 4,
}

export const visitSection = 'Start-up agreement';
