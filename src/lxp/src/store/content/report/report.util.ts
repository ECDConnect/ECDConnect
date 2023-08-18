import {
  ChildProgressObservationReport,
  ChildProgressReportSummaryModel,
} from '@ecdlink/core';

export const reportConvert = {
  ChildProgressObservationReport: {
    ChildProgressReportSummaryModel: (
      report: ChildProgressObservationReport
    ): ChildProgressReportSummaryModel => {
      return {
        reportId: report.id,
        categories: report.categories.map((c) => ({
          achievedLevelId: c.achievedLevelId,
          categoryId: c.categoryId,
          tasks: c.tasks.map((t) => ({
            levelId: t.levelId,
            skillId: t.skillId,
            value: t.value,
          })),
        })),
        childFirstName: report.childFirstname,
        childId: report.childId,
        childSurname: report.childSurname,
        classroomName: report.classroomName,
        reportDate: report.reportingDate,
        reportPeriod: report.reportingPeriod,
        reportDateCreated: report.dateCreated,
        reportDateCompleted: report.dateCompleted || '',
      };
    },
  },
};
