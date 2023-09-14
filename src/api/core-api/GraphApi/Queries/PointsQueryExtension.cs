using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.PointsEngine;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class PointsQueryExtension
    {
        public PointsQueryExtension() 
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<PointsUserSummary> GetPointsSummaryForUser(
            [Service] IPointsEngineService pointsService,
            string userId)
        {
            var pointsSummary = pointsService.GetSummaryUserPoints(userId, DateTime.Now.Year);

            return pointsSummary;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<PointsLibrary> GetPointsLibrary(
            [Service] IPointsEngineService pointsService)
        {
            var pointsLibrary = pointsService.GetPointsLibraryForTenant();

            return pointsLibrary;
        }
    }
}
