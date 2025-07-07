import { ProgressSkillValues } from '@/enums/ProgressSkillValues';

export type ChildProgressReport = {
  id: string;
  dateCreated: string;
  dateCompleted?: string;
  childId: string;
  childProgressReportPeriodId: string;
  notes?: string;
  skillsToWorkOn: ChildProgressSkillToWorkOn[];
  howToSupport?: string;
  skillObservations: ChildProgressSkillObservation[];
  observationsCompleteDate?: string;

  childEnjoys?: string;
  goodProgressWith?: string;
  howCanCaregiverSupport?: string;

  classroomName?: string;
  practitionerName?: string;
  principalName?: string;
  principalPhoneNumber?: string;
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
  id: string;
  childId: string;
  childProgressReportPeriodId: string;
  reportingPeriodNumber: number;
  reportingPeriodStartDate: Date;
  reportingPeriodEndDate: Date;
  notes?: string;
  dateCompleted?: string;
  observationsCompleteDate?: string;
  skillsToWorkOn: ChildProgressDetailedSkillToWorkOn[];
  unknownPercentage: number;
  unknownCount: number;
  howToSupport?: string;
  skillObservations: ChildProgressDetailedSkillObservation[];
  hasNegativeScores?: boolean;

  childEnjoys?: string;
  goodProgressWith?: string;
  howCanCaregiverSupport?: string;
  ageInMonthsAtReport: number | undefined;

  classroomName?: string;
  practitionerName?: string;
  principalName?: string;
  principalPhoneNumber?: string;
};

export type ChildProgressDetailedSkillObservation =
  ChildProgressSkillObservation & {
    skillName: string;
    skillDescription: string;
    subCategoryId: number;
    categoryId: number;
    isPositive: boolean;
    isNegative: boolean;
    isReverseScored?: boolean;
  };

export type ChildProgressDetailedSkillToWorkOn = {
  skillId: number;
  howToSupport: string;
  skillName: string;
  skillDescription: string;
  subCategoryId: number;
  categoryId: number;
};

export type ProgressReportsCategorySummary = {
  id: number;
  imageUrl: string;
  color: string;
  name: string;
  subTitle: string;
  description: string;
  subCategories: {
    id: number;
    imageUrl: string;
    name: string;
    title?: string;
    description: string;
    skills: {
      childrenWorkingOnSkillCount: number;
      id: number;
      description: string;
      name: string;
    }[];
  }[];
};
