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
        PractitionerProgressReportSummaryModel GetPractitionerProgressReportSummary(Guid userId, DateTime startDate, DateTime endDate, string locale);
        void CreateOrUpdateReport(ChildProgressReportModel input);
        IEnumerable<ChildProgressReportModel> GetChildProgressReportsForUser(Guid userId);
    }
}