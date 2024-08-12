using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.PointsEngine;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
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
        public List<UserRankingPointsModel> GetRankingDataForUser(
            [Service] IPointsEngineService pointsService,
            Guid userId,
            DateTime startDate,
            DateTime? endDate)
        {
            return pointsService.GetRankingDataForUser(userId, startDate, endDate);
        }


        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<PointsLibrary> GetPointsLibrary(
            [Service] IPointsEngineService pointsService)
        {
            // TODO: REMOVE
            //var pointsLibrary = pointsService.GetPointsLibraryForTenant();
            //return pointsLibrary;
            return null;
        }
        
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public UserClubStandingModel GetUserClubStanding(
            [Service] IPointsEngineService pointsService,
            string userId)
        {
            // TODO: REMOVE
            //var userStanding = pointsService.GetUserClubStanding(userId);
            //return userStanding;
            return null;
        }

    }
}
