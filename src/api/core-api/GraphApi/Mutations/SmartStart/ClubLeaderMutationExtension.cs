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
    public class ClubLeaderMutationExtension
    {
        public ClubLeaderMutationExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public ClubLeader AddNewClubLeader([Service] IClubService clubService, Guid clubId, Guid practitionerId)
        {
            return clubService.AddNewClubLeader(clubId, practitionerId);
        }

        public bool AcceptNewClubLeaderRole([Service] IClubService clubService, Guid clubId, Guid practitionerId, Guid clubSupportPractitionerId)
        {
            return clubService.AcceptNewClubLeaderRole(clubId, practitionerId, clubSupportPractitionerId);            
        }

        public bool RejectNewClubLeaderRole([Service] IClubService clubService, Guid clubId, Guid practitionerId)
        {
            return clubService.RejectNewClubLeaderRole(clubId, practitionerId);
        }

        public bool ChangeClubSupportRole([Service] IClubService clubService, Guid clubId, Guid practitionerId)
        {
            return clubService.ChangeClubSupportRole(clubId, practitionerId);
        }


    }
}
