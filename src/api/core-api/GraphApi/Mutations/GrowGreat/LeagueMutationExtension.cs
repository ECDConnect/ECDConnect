using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Input;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class LeagueMutationExtension
    {
        [Permission(PermissionGroups.LEAGUE, GraphActionEnum.Create)]
        public bool AddLeagues([Service] ILeagueService leagueService, List<LeagueInputModel> input)
        {
            leagueService.AddLeagues(input);

            return true;
        }

        [Permission(PermissionGroups.LEAGUE, GraphActionEnum.Update)]
        public bool EditLeague([Service] ILeagueService leagueService, Guid leagueId, string name, List<Guid> clinicsToAdd, List<Guid> clinicsToRemove)
        {
            leagueService.EditLeague(leagueId, name, clinicsToAdd, clinicsToRemove);

            return true;
        }

        [Permission(PermissionGroups.LEAGUE, GraphActionEnum.Delete)]
        public bool DeleteLeague([Service] ILeagueService leagueService, Guid leagueId)
        {
            leagueService.DeleteLeague(leagueId);

            return true;
        }

        [Permission(PermissionGroups.LEAGUE, GraphActionEnum.Update)]
        public bool AddClinicToLeague([Service] ILeagueService leagueService, Guid leagueId, Guid clinicId)
        {
            leagueService.AddClinicToLeague(leagueId, clinicId);

            return true;
        }
    }
}
