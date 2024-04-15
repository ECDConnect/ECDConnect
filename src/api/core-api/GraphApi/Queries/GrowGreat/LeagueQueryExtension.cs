using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;

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
    }
}
