import { ChildProgressReportSummaryModel } from '@ecdlink/core';
import { createSelector } from '@reduxjs/toolkit';
import { ContentReportState } from '.';
import { RootState } from '../../types';

export const getChildLatestCompletedReports = (childId?: string) =>
  createSelector(
    (state: RootState) => state.contentReportData,
    (contentReportState: ContentReportState) => {
      if (!contentReportState) return [];

      const childLocallyCompletedReports =
        contentReportState.childProgressionReports?.filter(
          (report) =>
            (!childId ? true : report.childId === childId) &&
            report.dateCompleted !== undefined &&
            report.dateCompleted !== null &&
            report.dateCompleted !== ''
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
            tasks:
              cat.tasks.map((t) => ({
                levelId: t.levelId,
                skillId: t.skillId,
                value: t.value,
              })) || [],
          })),
          childFirstName: report.childFirstname,
          childSurname: report.childSurname,
          reportDate: report.reportingDate,
          reportDateCompleted: report.dateCompleted || '',
          reportDateCreated: report.dateCreated || '',
          reportPeriod: report.reportingPeriod,
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
