using EcdLink.Api.CoreApi.GraphApi.Models.Community;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class CommunityProfileQueryExtension
    {
        [Permission(PermissionGroups.COMMUNITY, GraphActionEnum.View)]
        public CommunityProfileModel GetCommunityProfile([Service] ICommunityService communityService, Guid userId)
        {
            if (string.IsNullOrEmpty(userId.ToString()))
            {
                throw new ArgumentException("UserId is empty");
            }
            return communityService.GetCommunityProfile(userId);
        }

        [Permission(PermissionGroups.COMMUNITY, GraphActionEnum.View)]
        public List<CommunityConnectionModel> GetUsersToConnectWith(
            [Service] ICommunityService communityService,
            Guid userId,
            List<Guid> provinceIds = null,
            List<Guid> communitySkillIds = null,
            List<string> connectionTypes = null)
        {
            if (string.IsNullOrEmpty(userId.ToString()))
            {
                throw new ArgumentException("UserId is empty");
            }
            return communityService.GetUsersToConnectWith(userId, provinceIds, communitySkillIds, connectionTypes);
        }

        [Permission(PermissionGroups.COMMUNITY, GraphActionEnum.View)]
        public List<CommunitySkillModel> GetCommunitySkills(
            [Service] ICommunityService communityService)
        {
            return communityService.GetCommunitySkills();
        }

        [Permission(PermissionGroups.COMMUNITY, GraphActionEnum.View)]
        public List<SupportRatingModel> GetSupportRatings(
            [Service] ICommunityService communityService)
        {
            return communityService.GetSupportRatings();
        }

        [Permission(PermissionGroups.COMMUNITY, GraphActionEnum.View)]
        public List<FeedbackTypeModel> GetFeedbackTypes(
            [Service] ICommunityService communityService)
        {
            return communityService.GetFeedbackTypes();
        }

        [Permission(PermissionGroups.COMMUNITY, GraphActionEnum.View)]
        public List<CommunityConnectionModel> GetOtherConnections(
            [Service] ICommunityService communityService,
            Guid userId,
            List<Guid> provinceIds = null,
            List<Guid> communitySkillIds = null)
        {
            if (string.IsNullOrEmpty(userId.ToString()))
            {
                throw new ArgumentException("UserId is empty");
            }
            return communityService.GetOtherConnections(userId, provinceIds, communitySkillIds);
        }

    }
}
