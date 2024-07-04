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
        public CommunityProfileModel AcceptCommunityRequests(
          [Service] ICommunityService communionService,
          AcceptCommunityRequestsInputModel input)
        {
            if (!string.IsNullOrEmpty(input.UserIdAccepting.ToString()))
            {
                new ArgumentException("UserIdAccepting is empty.");
            }
            if (input.UserIdsToAccept.Count == 0)
            {
                new ArgumentException("UserIdsToAccept is empty.");
            }

            return communionService.AcceptCommunityRequests(input);
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
