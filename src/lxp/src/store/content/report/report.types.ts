import {
  ChildProgressObservationReport,
  ChildProgressReportSummaryModel,
} from '@ecdlink/core';

export type UnSyncedReportItem = {
  reportId: string;
  classroomGroupId: string;
  promptUser?: boolean;
};

export type ContentReportState = {
  childProgressionReports?: ChildProgressObservationReport[];
  childProgressReportSummaries?: ChildProgressReportSummaryModel[];
  unsyncedChildProgressReportsIds?: UnSyncedReportItem[];
};

export type ChildProgressReportQueryParams = {
  userId: string;
};
