export const RESOURCE_PROBLEM_TYPES = [
  'Link does not work',
  'It is not data free',
  'The information is out of date',
  'Content is wrong or confusing',
  'Content is inappropriate',
  'Something else',
] as const;

export type ResourceProblemType = (typeof RESOURCE_PROBLEM_TYPES)[number];

export interface ReportResourceProblemInput {
  contentId: number;
  problemType: ResourceProblemType;
  additionalDetails?: string;
  dataFreeAtReport: string;
  linkAtReport: string;
}
