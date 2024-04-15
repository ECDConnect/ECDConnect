using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Input;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
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
    }
}
