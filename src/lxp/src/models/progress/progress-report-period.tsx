import { ChildProgressReportPeriodDto } from '../classroom/classroom.dto';

export type ProgressReportPeriod = ChildProgressReportPeriodDto & {
  reportNumber: number;
};
