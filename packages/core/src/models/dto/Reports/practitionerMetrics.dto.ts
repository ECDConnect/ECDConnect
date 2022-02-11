import { MetricReportStatItem } from './metricReportStatItem.dto';

export interface PractitionerMetricReport {
  outstandingSyncs: number;
  completedProfiles: number;
  avgChildren: number;
  statusData: MetricReportStatItem[];
  programTypesData: MetricReportStatItem[];
}
