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
    public class ClubSupportMutationExtension
    {
        public ClubSupportMutationExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public ClubSupport UpdateClubSupportStatus([Service] IClubService clubService, Guid practitionerId)
        {
            return clubService.UpdateClubSupportStatus(practitionerId);
        }



    }
}
