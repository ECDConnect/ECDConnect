using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Reports;
using ECDLink.DataAccessLayer.Entities.Users;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Services.Interfaces
{
    public interface IChildProgressReportService
    {
        //Task<string> GenerateChildProgressReport(Guid userId, Guid childId, Guid classgroupId, DateTime reportDate);
        //Task<string> GenerateReport(ChildProgressReport reportEntity, Practitioner practitioner, string currentProfileImageUrl, Document document);
        //ChildProgressReportDetailedModel GetChildProgressReport(Guid userId, Guid reportId);
        //IEnumerable<ChildProgressReportDetailedModel> GetChildProgressReports(Guid userId, int count);
        //(int reportsSubmittedOnTime, int reportsMissingOrIncomplete, int reportsSubmittedOverdue) GetChildProgressReportStatusCountsForPractitioner(string practitionerHierarcry, IEnumerable<Guid> classroomGroupIds);
        //IEnumerable<ChildProgressReportSummaryModel> GetChildProgressReportSummary(Guid userId, int count);
        PractitionerProgressReportSummaryModel GetPractitionerProgressReportSummary(Guid userId, DateTime startDate, DateTime endDate, string locale);
        //PractitionerProgressReportSummaryModel GetPrincipalProgressReportSummary(Guid userId, DateTime startDate, DateTime endDate, string locale);


        void CreateOrUpdateReport(ChildProgressReportModel input);
        IEnumerable<ChildProgressReportModel> GetChildProgressReportsForUser(Guid userId);
    }
}