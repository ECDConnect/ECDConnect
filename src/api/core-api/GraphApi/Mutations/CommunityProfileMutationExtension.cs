using EcdLink.Api.CoreApi.GraphApi.Models.Community;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class CommunityProfileMutationExtension
    {
        [Permission(PermissionGroups.COMMUNITY, GraphActionEnum.Create)]
        public CommunityProfileModel SaveCommunityProfile(
          [Service] ICommunityService communionService,
          CommunityProfileInputModel input)
        {
            if (input == null)
            {
                new ArgumentException("Input is empty.");
            }

            return communionService.SaveCommunityProfile(input);
        }

        [Permission(PermissionGroups.COMMUNITY, GraphActionEnum.Create)]
        public CommunityProfileModel AcceptRejectCommunityRequests(
          [Service] ICommunityService communionService,
          AcceptRejectCommunityRequestsInputModel input)
        {
            if (!string.IsNullOrEmpty(input.UserId.ToString()))
            {
                new ArgumentException("UserId is empty.");
            }
            return communionService.AcceptRejectCommunityRequests(input);
        }

        [Permission(PermissionGroups.COMMUNITY, GraphActionEnum.Create)]
        public bool DeleteCommunityProfile(
          [Service] ICommunityService communionService,
          Guid communityProfileId)
        {
            if (!string.IsNullOrEmpty(communityProfileId.ToString()))
            {
                new ArgumentException("CommunityProfileId is empty.");
            }

            return communionService.DeleteCommunityProfile(communityProfileId);
        }

    }
}
