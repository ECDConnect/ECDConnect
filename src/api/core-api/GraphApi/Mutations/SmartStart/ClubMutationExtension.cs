using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ClubMutationExtension
    {
        public ClubMutationExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public Club ChangeClubName([Service] IClubService clubService, string clubId, string clubName)
        {
            return clubService.ChangeClubName(new Guid(clubId), clubName);
        }

    }
}
