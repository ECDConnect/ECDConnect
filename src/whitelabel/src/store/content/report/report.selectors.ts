import {
  ChildProgressObservationReport,
  ChildProgressReportSummaryModel,
} from '@ecdlink/core';
import { createSelector } from '@reduxjs/toolkit';
import { ContentReportState } from '.';
import { isMatchingReportingPeriods } from '@utils/child/child-profile-utils';
import { RootState } from '../../types';
import { UnSyncedReportItem } from './report.types';

export const getChildProgressObservationReports = (childId: string) =>
  createSelector(
    (state: RootState) => state.contentReportData.childProgressionReports || [],
    (
      stateReports: ChildProgressObservationReport[]
    ): ChildProgressObservationReport[] => {
      const reports = stateReports.filter((mr) => {
        return mr.childId === childId;
      });

      return reports;
    }
  );

export const hasUnsyncedReports = createSelector(
  (state: RootState) =>
    state.contentReportData.unsyncedChildProgressReportsIds || [],
  (reportIds: UnSyncedReportItem[]) => reportIds.length > 0
);

export const getChildCompletedObservationReports = (childId?: string) =>
  createSelector(
    (state: RootState) => state.contentReportData.childProgressionReports || [],
    (reports: ChildProgressObservationReport[]) =>
      reports.filter(
        (x) => x.childId === childId && x.dateCompleted !== undefined
      )
  );

export const getAllChildProgressObservationReports = (
  state: RootState
): ChildProgressObservationReport[] =>
  state.contentReportData.childProgressionReports || [];

export const getChildProgressReportSummaries = (childId?: string) =>
  createSelector(
    (state: RootState) =>
      state.contentReportData.childProgressReportSummaries || [],
    (summaries: ChildProgressReportSummaryModel[]) =>
      summaries
        .filter((summary) => summary.childId === childId)
        .sort((a, b) =>
          new Date(a.reportDate) > new Date(b.reportDate) ? 1 : -1
        )
  );

export const getChildProgressObservationReportByReportingPeriod = (
  reportingDate: Date,
  childId?: string
) =>
  createSelector(
    (state: RootState) => state.contentReportData.childProgressionReports || [],
    (reports: ChildProgressObservationReport[]) =>
      reports.find(
        (report) =>
          report.childId === childId &&
          isMatchingReportingPeriods(
            new Date(report.reportingDate),
            reportingDate
          )
      )
  );

export const getChildLatestCompletedReports = (childId?: string) =>
  createSelector(
    (state: RootState) => state.contentReportData,
    (contentReportState: ContentReportState) => {
      if (!contentReportState) return [];

      const childLocallyCompletedReports =
        contentReportState.childProgressionReports?.filter(
          (report) =>
            (!childId ? true : report.childId === childId) &&
            report.dateCompleted !== undefined
        ) || [];

      const excludingSummaries =
        contentReportState.childProgressReportSummaries?.filter(
          (summary) =>
            (!childId ? true : summary.childId === childId) &&
            !childLocallyCompletedReports.some(
              (report) => report.id === summary.reportId
            )
        ) || [];

      const completdLocalReportAsSummaries: ChildProgressReportSummaryModel[] =
        childLocallyCompletedReports.map((report) => ({
          childId: report.childId,
          categories: report.categories.map((cat) => ({
            categoryId: cat.categoryId,
            achievedLevelId: cat.achievedLevelId,
          })),
          childFirstName: report.childFirstname,
          childSurname: report.childSurname,
          reportDate: report.reportingDate,
          reportId: report.id,
          classroomName: report.classroomName,
        }));

      const mergedSummaries = [
        ...completdLocalReportAsSummaries,
        ...excludingSummaries,
      ];

      const sortedSummaries = mergedSummaries.sort((a, b) =>
        new Date(a.reportDate) > new Date(b.reportDate) ? -1 : 1
      );
      return sortedSummaries;
    }
  );
