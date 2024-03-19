using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
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
            string userId,
            DateTime startDate,
            DateTime? endDate)
        {
            var pointsSummary = pointsService.GetOldSummaryUserPoints(Guid.Parse(userId), startDate, endDate);

            return pointsSummary;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<PointsLibrary> GetPointsLibrary(
            [Service] IPointsEngineService pointsService)
        {
            var pointsLibrary = pointsService.GetPointsLibraryForTenant();

            return pointsLibrary;
        }
        
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public UserClubStandingModel GetUserClubStanding(
            [Service] IPointsEngineService pointsService,
            string userId)
        {
            var userStanding = pointsService.GetUserClubStanding(userId);

            return userStanding;
        }
    }
}
