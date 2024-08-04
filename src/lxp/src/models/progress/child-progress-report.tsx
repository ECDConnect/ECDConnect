import { ProgressSkillValues } from '@/enums/ProgressSkillValues';

export type ChildProgressReport = {
  id: string;
  dateCreated: string;
  dateCompleted?: string;
  childId: string;
  childProgressReportPeriodId: string;
  isComplete: boolean;
  notes?: string;
  skillsToWorkOn: ChildProgressSkillToWorkOn[];
  howToSupport?: string;
  skillObservations: ChildProgressSkillObservation[];
};

export type ChildProgressSkillObservation = {
  skillId: number;
  value: ProgressSkillValues;
};

export type ChildProgressSkillToWorkOn = {
  skillId: number;
  howToSupport: string;
};

export type ChildProgressDetailedReport = {
  childId: string;
  childProgressReportPeriodId: string;
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
