using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using ECDLink.Api.CoreApi.Services.Interfaces;
using EcdLink.Api.CoreApi.GraphApi.Models;
using System.Collections.Generic;
using System.Linq;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ClubQueryExtention
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public ClubModel GetClubForUser(
            [Service] IClubService clubService,
            string userId)
        {
            var club = clubService.GetClubForUser(userId);

            return club;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<DetailClubModel> GetClubsForCoach(
            [Service] IClubService clubService,
            string coachUserId)
        {
            var clubs = clubService.GetClubsForCoach(coachUserId);

            return clubs.ToList();
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public DetailClubModel GetClubsForCoach(
            [Service] IClubService clubService,
            Guid clubId)
        {
            var club = clubService.GetClubById(clubId);

            return club;
        }        
    }
}