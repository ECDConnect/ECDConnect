using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.GraphApi.Models.Points;
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
            return pointsService.GetSummaryUserPoints(Guid.Parse(userId), startDate, endDate);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<PointsActivity> GetPointActivities([Service] IPointsEngineService pointsService)
        {
            return pointsService.GetPointActivities();
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public PointsToDoItemModel GetPointsTodoItems(
            [Service] IPointsEngineService pointsService,
            Guid userId)
        {
            return pointsService.GetPointsTodoItems(userId);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public PointsUserYearMonthSummary GetYearPointsView(
            [Service] IPointsEngineService pointsService,
            Guid userId)
        {
            return pointsService.GetYearPointsView(userId);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public PointsUserDateSummary GetSharedData(
            [Service] IPointsEngineService pointsService,
            Guid userId,
            bool isMonthly)
        {
            return pointsService.GetSharedData(userId, isMonthly);
        }

    }
}
