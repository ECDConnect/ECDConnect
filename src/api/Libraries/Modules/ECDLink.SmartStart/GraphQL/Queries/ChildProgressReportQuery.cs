using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Reporting;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Reports;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.SmartStart.Reports.ChildProgressReport;
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
            IGenericRepositoryFactory repoFactory,
            [Service] ChildProgressReportService report,
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            Guid childId,
            Guid classgroupId,
            DateTime reportDate)
        {
            var progressReportRepo = repoFactory.CreateRepository<ChildProgressReport>(userContext: httpContextAccessor.HttpContext.GetUser().Id);

            var progressReportEntity = progressReportRepo
                                            .GetAll()
                                            .Where(x =>
                                                    x.ClassroomGroupId == classgroupId
                                                    && x.ChildId == childId
                                                    && x.ReportDate.Month == reportDate.Month && x.ReportDate.Year == reportDate.Year)
                                            .FirstOrDefault();

            if (progressReportEntity == default)
            {
                return null;
            }

            using var dbScope = dbFactory.CreateDbContext();

            var document = dbScope.Documents
                                  .Where(x => string.Equals(x.Name, ReportConstants.ChildProgressReport) && x.IsActive)
                                  .FirstOrDefault();

            return await report.GenerateReport(progressReportEntity, document);
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public async Task<ChildProgressReportDetailedModel> GetChildProgressReport(
            IGenericRepositoryFactory repoFactory,
            [Service] IHttpContextAccessor httpContextAccessor,
            Guid reportId)
        {
            var reportRepo = repoFactory.CreateRepository<ChildProgressReport>();
            reportRepo.SetUserContext(httpContextAccessor.HttpContext.GetUser().Id);

            var summaryEntity = reportRepo.GetById(reportId);

            return JsonConvert.DeserializeObject<ChildProgressReportDetailedModel>(summaryEntity.ReportContent);
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public async Task<IEnumerable<ChildProgressReportSummaryModel>> GetChildProgressReportSummary(
            IGenericRepositoryFactory repoFactory,
            [Service] IHttpContextAccessor httpContextAccessor,
            int count)
        {
            var reportRepo = repoFactory.CreateRepository<ChildProgressReport>();
            reportRepo.SetUserContext(httpContextAccessor.HttpContext.GetUser().Id);

            var summaryEntities = reportRepo.GetAll()
                                    .OrderByDescending(x => x.ReportDate)
                                    .Take(count)
                                    .ToList();

            var summaries = new List<ChildProgressReportSummaryModel>();

            foreach (var item in summaryEntities)
            {
                var report = JsonConvert.DeserializeObject<ChildProgressReportDetailedModel>(item.ReportContent);

                if (report == default(ChildProgressReportDetailedModel))
                {
                    continue;
                }

                var summary = new ChildProgressReportSummaryModel
                {
                    Categories = report?.Categories?.Select(x => new ObservationCategorySummary
                    {
                        AchievedLevelId = x.AchievedLevelId,
                        CategoryId = x.CategoryId
                    }).ToList() ?? new List<ObservationCategorySummary>(),
                    ChildFirstname = report.ChildFirstname,
                    ChildSurname = report.ChildSurname,
                    ClassroomName = report.ClassroomName,
                    ReportDate = report.ReportingDate,
                    ChildId = report.ChildId,
                    ReportId = item.Id,
                };

                summaries.Add(summary);
            }

            return summaries;
        }
    }
}
