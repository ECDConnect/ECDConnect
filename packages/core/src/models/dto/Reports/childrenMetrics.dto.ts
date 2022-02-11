import { MetricReportStatItem } from './metricReportStatItem.dto';

export interface ChildrenMetricReport {
  unverifiedDocuments: number;
  totalChildren: number;
  totalChildProgressReports: number;
  statusData: MetricReportStatItem[];
  childAttendacePerMonthData: MetricReportStatItem[];
}
