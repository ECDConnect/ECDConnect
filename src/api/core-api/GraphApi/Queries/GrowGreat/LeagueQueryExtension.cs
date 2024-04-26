using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class LeagueQueryExtension
    {

        [Permission(PermissionGroups.LEAGUE, GraphActionEnum.View)]
        public LeagueSetupModel GetLeagueSetupDetails(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] ILeagueService leagueService,
            IGenericRepositoryFactory repoFactory)
        {
            var user = contextAccessor.HttpContext.GetUser();

            // Validation - CHeck user role?, check date?
            //if (DateTime.Now.Month != 8 || DateTime.Now.Month != 9)
            //{
            //    throw new Exception("Outside of league setup window");
            //}

            var leagueSetup = leagueService.GetLeagueSetup();

            return leagueSetup;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public LeagueClinicsModel GetLeagueById([Service] IPointsEngineService pointsService, Guid leagueId)
        {
            var league = pointsService.GetLeagueWithClinicRankings(leagueId);
            return league;
        }

        [Permission(PermissionGroups.LEAGUE, GraphActionEnum.View)]
        [UseFiltering]
        [UseSorting]
        public List<PortalLeagueModel> GetLeagues(
            [Service] ILeagueService leagueService, 
            DateTime? startDate,
            DateTime? endDate,
            string searchString,
            Guid? districtId,
            PagedQueryInput pagingInput)
        {
            var leagues = leagueService.GetLeagues(startDate, endDate, searchString, districtId, pagingInput);
            return leagues;
        }

        [Permission(PermissionGroups.LEAGUE, GraphActionEnum.View)]
        public LeagueWithRankingsModel GetLeague(
            [Service] ILeagueService pointsService,
            Guid leagueId,
            DateTime startDate,
            DateTime endDate)
        {
            var league = pointsService.GetLeague(leagueId, startDate, endDate);
            return league;
        }

        [Permission(PermissionGroups.LEAGUE, GraphActionEnum.View)]
        public List<PortalLeagueModel> GetLeaguesForTeamLead(
            [Service] ILeagueService leagueService,
            Guid teamLeadUserId)
        {
            return leagueService.GetLeaguesForTeamLead(teamLeadUserId);
        }
    }
}
