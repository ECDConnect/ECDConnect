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
        public CommunityProfileModel GetCommunityProfile([Service] ICommunityService communionService, Guid userId)
        {
            if (string.IsNullOrEmpty(userId.ToString()))
            {
                throw new ArgumentException("UserId is empty");
            }
            return communionService.GetCommunityProfile(userId);
        }

        [Permission(PermissionGroups.COMMUNITY, GraphActionEnum.View)]
        public List<CommunityConnectionModel> GetUsersToConnectWith(
            [Service] ICommunityService communionService,
            Guid? provinceId,
            Guid? communitySkillId,
            string connectionType,
            Guid userId)
        {
            if (string.IsNullOrEmpty(userId.ToString()))
            {
                throw new ArgumentException("UserId is empty");
            }
            return communionService.GetUsersToConnectWith(provinceId, communitySkillId, connectionType, userId);
        }



    }
}
