export type ProgressSkill = {
  id: number;
  name: string;
  description: string;
  subCategory: ProgressSubCategory;
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
  value?: string;
};
