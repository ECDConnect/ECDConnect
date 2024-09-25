using EcdLink.Api.CoreApi.GraphApi.Models;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.Services.Interfaces
{
    public interface IChildProgressReportService
    {
        PractitionerProgressReportSummaryModel GetPractitionerProgressReportSummary(Guid userId, DateTime startDate, DateTime endDate, string locale);
        void CreateOrUpdateReport(ChildProgressReportModel input);
        IEnumerable<ChildProgressReportModel> GetChildProgressReportsForUser(Guid userId);
    }
}