export interface PointsSummaryDto {
  month: number;
  pointsTotal: number;
  pointsYTD: number;
  year: number;
  activity: string;
  description: string;
  maxMonthlyPoints: number;
  pointsPerAward: number;
  subActivity?: string;
}
