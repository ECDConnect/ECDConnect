using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Reporting;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Workflow;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.SmartStart.GraphQL.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ChildProgressReportMutation
    {
        [Permission(PermissionGroups.REPORTING, GraphActionEnum.Create)]
        public bool CreateOrUpdateChildProgressReport(
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IChildProgressReportService progressService,
            ChildProgressReportModel input)
        {
            progressService.CreateOrUpdateReport(input);

            return true;
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.Update)]
        public bool ClassroomProgressSummaryDownloaded(
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IPointsEngineService pointsService,
            Guid classroomGroupId)
        {
            pointsService.CalculateDownloadPreschoolOrClassProgressSummary(httpContextAccessor.HttpContext.GetUser().Id);

            return true;
        }
    }
}
