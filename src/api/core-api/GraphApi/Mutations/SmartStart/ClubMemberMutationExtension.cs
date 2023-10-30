using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ClubMemberMutationExtension
    {
        public ClubMemberMutationExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public bool AddNewClubMembers([Service] IClubService clubService, NewClubMember input)
        {
            return clubService.AddNewClubMembers(input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public bool MoveClubMembers([Service] IClubService clubService, NewClubMember input)
        {
            return clubService.MoveClubMembers(input);

        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public bool SaveWelcomeMessage([Service] IClubService clubService, Guid clubId, Guid practitionerId, string welcomeMessage)
        {
            return clubService.SaveWelcomeMessage(clubId, practitionerId, welcomeMessage);

        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public bool UpdateNewMemberStatus([Service] IClubService clubService, Guid clubId, Guid practitionerId)
        {
            return clubService.UpdateNewMemberStatus(clubId, practitionerId);

        }
    }
}
