using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Reporting;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Reports;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.SmartStart.Reports.ChildProgressReport;
using ECDLink.SmartStart.Services;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.SmartStart.GraphQL.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ChildProgressReportQuery
    {
        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public async Task<string> GenerateChildProgressReport(
            [Service] ChildProgressReportService report,
            [Service] IHttpContextAccessor httpContextAccessor,
            Guid childId,
            Guid classgroupId,
            DateTime reportDate)
        {
          return await report.GenerateChildProgressReport(httpContextAccessor.HttpContext.GetUser().Id, childId, classgroupId, reportDate);
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public async Task<ChildProgressReportDetailedModel> GetChildProgressReport(
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] ChildProgressReportService report,
            Guid reportId)
        {
          return await report.GetChildProgressReport(httpContextAccessor.HttpContext.GetUser().Id, reportId);
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public async Task<IEnumerable<ChildProgressReportDetailedModel>> GetChildProgressReports(
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] ChildProgressReportService report,
            int count)
        {
          return await report.GetChildProgressReports(httpContextAccessor.HttpContext.GetUser().Id, count);
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public async Task<IEnumerable<ChildProgressReportSummaryModel>> GetChildProgressReportSummary(
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] ChildProgressReportService report,
            int count)
        {
          return await report.GetChildProgressReportSummary(httpContextAccessor.HttpContext.GetUser().Id, count);
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public async Task<PractitionerProgressReportSummaryModel> GetPractitionerProgressReportSummary(
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] ChildProgressReportService report,
            string reportingPeriod,
            string locale)
        {
            return await report.GetPractitionerProgressReportSummary(httpContextAccessor.HttpContext.GetUser().Id, reportingPeriod, locale);
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public async Task<PractitionerProgressReportSummaryModel> GetPrincipalProgressReportSummary(
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] ChildProgressReportService report,
            string reportingPeriod,
            string locale)
        {
            return await report.GetPrincipalProgressReportSummary(httpContextAccessor.HttpContext.GetUser().Id, reportingPeriod, locale);
        }
    }
}
