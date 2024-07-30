export type ChildProgressReport = {
  childId: string;
  reportingPeriodId: string;
  isComplete: boolean;
  notes?: string;
  skillsToWorkOn: ChildProgressSkillToWorkOn[];
  howToSupport?: string;
  skillObservations: ChildProgressSkillObservation[];
};

export type ChildProgressSkillObservation = {
  skillId: number;
  value: string;
};

export type ChildProgressSkillToWorkOn = {
  skillId: number;
  howToSupport: string;
};

export type ChildProgressDetailedReport = {
  childId: string;
  reportingPeriodId: string;
  reportingPeriodNumber: number;
  reportingPeriodStartDate: Date;
  reportingPeriodEndDate: Date;
  isComplete: boolean;
  notes?: string;
  skillsToWorkOn: ChildProgressDetailedSkillToWorkOn[];
  unknownPercentage: number;
  unknownCount: number;
  howToSupport?: string;
  skillObservations: ChildProgressDetailedSkillObservation[];
};

export type ChildProgressDetailedSkillObservation =
  ChildProgressSkillObservation & {
    skillName: string;
    subCategoryId: number;
    categoryId: number;
    isPositive: boolean;
    isNegative: boolean;
  };

export type ChildProgressDetailedSkillToWorkOn = {
  skillId: number;
  howToSupport: string;
  skillName: string;
  subCategoryId: number;
  categoryId: number;
};
