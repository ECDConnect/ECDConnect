export interface PointsSummaryDto {
  pointsLibraryId: string;
  month: number;
  pointsTotal: number;
  pointsYTD: number;
  timesScored: number;
  year: number;
  activity: string;
  description: string;
  todoDescription: string;
  maxMonthlyPoints: number;
  maxYearlyPoints: number;
  pointsPerAward: number;
  subActivity?: string;
}
