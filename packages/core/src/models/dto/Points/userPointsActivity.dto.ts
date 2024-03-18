export interface UserPointsAcitivtyDto {
  pointsActivityId: string;
  month: number;
  year: number;
  pointsTotal: number;
  timesScored: number;
  activityName: string;
  todoDescription: string;
  maxMonthlyPoints?: number;
}
