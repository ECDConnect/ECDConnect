import { ProgressSkillValues } from '@/enums/ProgressSkillValues';

export type ProgressSkill = {
  id: number;
  name: string;
  description: string;
  subCategory: ProgressSubCategory;
  isReverseScored?: boolean;
  supportImage?: string;
};

export type ProgressSubCategory = {
  id: number;
  name: string;
  category: ProgressCategory;
};

export type ProgressCategory = {
  id: number;
  name: string;
};

export type ChildProgressSkill = ProgressSkill & {
  value?: ProgressSkillValues;
};
