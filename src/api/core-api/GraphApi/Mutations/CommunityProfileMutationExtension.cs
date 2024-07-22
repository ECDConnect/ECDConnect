using EcdLink.Api.CoreApi.GraphApi.Models.Community;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities.Community;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class CommunityProfileMutationExtension
    {
        [Permission(PermissionGroups.COMMUNITY, GraphActionEnum.Create)]
        public CommunityProfileModel SaveCommunityProfile(
          [Service] ICommunityService communityService,
          CommunityProfileInputModel input)
        {
            if (input == null)
            {
                new ArgumentException("Input is empty.");
            }
            return communityService.SaveCommunityProfile(input);
        }

        [Permission(PermissionGroups.COMMUNITY, GraphActionEnum.Update)]
        public CommunityProfileModel AcceptRejectCommunityRequests(
          [Service] ICommunityService communityService,
          AcceptRejectCommunityRequestsInputModel input)
        {
            if (!string.IsNullOrEmpty(input.UserId.ToString()))
            {
                new ArgumentException("UserId is empty.");
            }
            return communityService.AcceptRejectCommunityRequests(input);
        }

        [Permission(PermissionGroups.COMMUNITY, GraphActionEnum.Delete)]
        public bool DeleteCommunityProfile(
          [Service] ICommunityService communityService,
          Guid communityProfileId)
        {
            if (!string.IsNullOrEmpty(communityProfileId.ToString()))
            {
                new ArgumentException("CommunityProfileId is empty.");
            }

            return communityService.DeleteCommunityProfile(communityProfileId);
        }

        [Permission(PermissionGroups.COMMUNITY, GraphActionEnum.Create)]
        public List<CommunityProfileConnection> SaveCommunityProfileConnections(
          [Service] ICommunityService communityService,
          List<CommunityConnectInputModel> input
          )
        {
            if (input == null || input.Count == 0)
            {
                new ArgumentException("input is empty.");
            }

            return communityService.SaveCommunityProfileConnections(input);
        }

        [Permission(PermissionGroups.COMMUNITY, GraphActionEnum.Update)]
        public CommunityProfileConnection CancelCommunityRequest(
          [Service] ICommunityService communityService,
          CommunityConnectInputModel input
          )
        {
            if (input == null)
            {
                new ArgumentException("input is empty.");
            }

            return communityService.CancelCommunityRequest(input);
        }

        [Permission(PermissionGroups.COMMUNITY, GraphActionEnum.Update)]
        public bool UpdateClickedECDHeros(
          [Service] ICommunityService communityService,
          Guid userId
          )
        {
            if (string.IsNullOrEmpty(userId.ToString()))
            {
                new ArgumentException("userId is empty.");
            }

            return communityService.UpdateClickedECDHeros(userId);
        }

    }
}
