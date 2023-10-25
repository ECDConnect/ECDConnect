using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using ECDLink.Api.CoreApi.Services.Interfaces;
using EcdLink.Api.CoreApi.GraphApi.Models;

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
    }
}