export type ChildProgressReport = {
  childId: string;
  reportingPeriodId: string;
  // TODO - Whatever other details are required
  isComplete: boolean;
  // Skills to work on, with text description
  // PractionerId???
  // DateCompleted?
  // Note
  // PractitionerNote
  skillObservations: {
    skillId: number;
    value: string;
  }[];
};

export type ChildProgressDetailedReport = {
  childId: string;
  reportingPeriodId: string;
  reportingPeriodNumber: number;
  reportingPeriodStartDate: Date;
  reportingPeriodEndDate: Date;
  isComplete: boolean;
  // Skills to work on, with text description
  // PractionerId???
  // DateCompleted?
  // Note
  // PractitionerNote
  skillObservations: {
    skillId: number;
    skillName: string;
    value: string;
    subCategoryId: number;
    categoryId: number;
  }[];
};
