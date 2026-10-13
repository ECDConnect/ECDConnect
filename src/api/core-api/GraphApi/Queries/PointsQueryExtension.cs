using EcdLink.Api.CoreApi.GraphApi.Models.Points;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.PointsEngine;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
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

        [Permission(PermissionGroups.POINTS, GraphActionEnum.View)]
        public List<PointsUserSummary> GetPointsSummaryForUser(
            [Service] IPointsEngineService pointsService,
            [Service] IHttpContextAccessor contextAccessor,
            string userId,
            DateTime startDate,
            DateTime? endDate)
        {
            // The installed app can call this during startup before the profile
            // id is available, and then omit userId. Use the signed-in user.
            if (!Guid.TryParse(userId, out var parsedUserId))
            {
                var currentUserId = contextAccessor.HttpContext?.GetUserId();
                if (!currentUserId.HasValue)
                {
                    throw new GraphQLException("User id is required.");
                }

                parsedUserId = currentUserId.Value;
            }

            return pointsService.GetSummaryUserPoints(parsedUserId, startDate, endDate);
        }

        [Permission(PermissionGroups.POINTS, GraphActionEnum.View)]
        public List<PointsActivity> GetPointActivities([Service] IPointsEngineService pointsService)
        {
            return pointsService.GetPointActivities();
        }

        [Permission(PermissionGroups.POINTS, GraphActionEnum.View)]
        public PointsToDoItemModel GetPointsTodoItems(
            [Service] IPointsEngineService pointsService,
            Guid userId)
        {
            return pointsService.GetPointsTodoItems(userId);
        }

        [Permission(PermissionGroups.POINTS, GraphActionEnum.View)]
        public PointsUserYearMonthSummary GetYearPointsView(
            [Service] IPointsEngineService pointsService,
            Guid userId)
        {
            return pointsService.GetYearPointsView(userId);
        }

        [Permission(PermissionGroups.POINTS, GraphActionEnum.View)]
        public PointsUserDateSummary GetSharedData(
            [Service] IPointsEngineService pointsService,
            Guid userId,
            bool isMonthly)
        {
            return pointsService.GetSharedData(userId, isMonthly);
        }

    }
}
