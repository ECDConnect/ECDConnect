using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ClubLeaderMutationExtension
    {
        public ClubLeaderMutationExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public Task<ClubLeader> AddNewClubLeader([Service] IClubService clubService, string clubId, string practitionerId)
        {
            return clubService.AddNewClubLeader(new Guid(clubId), new Guid(practitionerId));
        }

    }
}
