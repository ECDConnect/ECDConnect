using EcdLink.Api.CoreApi.GraphApi.Models.ChildProgress;
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
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ChildProgressReportQuery
    {
        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public List<ChildProgressReportModel> GetChildProgressReportsForUser(
            [Service] IChildProgressReportService progressService,
            [Service] IHttpContextAccessor httpContextAccessor,
            Guid userId)
        {
            return progressService.GetChildProgressReportsForUser(userId).ToList();
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
