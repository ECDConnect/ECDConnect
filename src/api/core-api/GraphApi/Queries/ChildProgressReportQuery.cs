using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Services;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Extensions;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ChildProgressReportQuery
    {
        // GENERATES PDF MIGHT NOT BE NEEDED ANYMORE
        // TODO: Should this just take a learner id ?
        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public async Task<string> GenerateChildProgressReport(
            [Service] IChildProgressReportService report,
            [Service] IHttpContextAccessor httpContextAccessor,
            Guid childId,
            Guid classgroupId,
            DateTime reportDate)
        {
          return await report.GenerateChildProgressReport(httpContextAccessor.HttpContext.GetUser().Id, childId, classgroupId, reportDate);
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public ChildProgressReportDetailedModel GetChildProgressReport(
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IChildProgressReportService report,
            Guid reportId)
        {
            return report.GetChildProgressReport(httpContextAccessor.HttpContext.GetUser().Id, reportId);
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public IEnumerable<ChildProgressReportDetailedModel> GetChildProgressReports(
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IChildProgressReportService report,
            int count)
        {
          return report.GetChildProgressReports(httpContextAccessor.HttpContext.GetUser().Id, count);
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public IEnumerable<ChildProgressReportSummaryModel> GetChildProgressReportSummary(
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IChildProgressReportService report,
            int count)
        {
          return report.GetChildProgressReportSummary(httpContextAccessor.HttpContext.GetUser().Id, count);
        }

        // THIS AND BELOW, MIGHT JUST WORK FOR BOTH NOW... Just need to test to check
        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public PractitionerProgressReportSummaryModel GetProgressReportSummaryForPractitioner(
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IChildProgressReportService report,
            DateTime startDate,
            DateTime endDate,
            string locale)
        {
            return report.GetPractitionerProgressReportSummary(httpContextAccessor.HttpContext.GetUser().Id, startDate, endDate, locale);
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public PractitionerProgressReportSummaryModel GetProgressReportSummaryForPrincipalForPrincipal(
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IChildProgressReportService report,
            DateTime startDate,
            DateTime endDate,
            string locale)
        {
            return report.GetPrincipalProgressReportSummary(httpContextAccessor.HttpContext.GetUser().Id, startDate, endDate, locale);
        }





        // Temporary, so old stuff still works
        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public PractitionerProgressReportSummaryModel GetPractitionerProgressReportSummary(
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IChildProgressReportService report,
            string reportingPeriod,
            string locale)
        {
            var startDate = GetDateFromReportingPeriod(reportingPeriod);
            return report.GetPractitionerProgressReportSummary(httpContextAccessor.HttpContext.GetUser().Id, startDate, startDate.GetEndOfMonth(), locale);
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public PractitionerProgressReportSummaryModel GetPrincipalProgressReportSummary(
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IChildProgressReportService report,
            string reportingPeriod,
            string locale)
        {
            var startDate = GetDateFromReportingPeriod(reportingPeriod);
            return report.GetPrincipalProgressReportSummary(httpContextAccessor.HttpContext.GetUser().Id, startDate, startDate.GetEndOfMonth(), locale);
        }

        private DateTime GetDateFromReportingPeriod(string reportingPeriod)
        {
            if (reportingPeriod.Length < 8) return DateTime.MinValue;
            var month = reportingPeriod.Substring(0, 3).ToLower();
            int year = 1900;
            int.TryParse(reportingPeriod.Substring(reportingPeriod.Length - 4, 4), out year);
            if (month == "jun") return new DateTime(year, 6, 1);
            if (month == "nov") return new DateTime(year, 11, 1);
            return DateTime.MinValue;
        }
    }
}
