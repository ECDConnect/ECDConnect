using EcdLink.Api.CoreApi.GraphApi.Models.Community;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class CommunityProfileQueryExtension
    {
        [Permission(PermissionGroups.COMMUNITY, GraphActionEnum.View)]
        public CommunityProfileModel GetCommunityProfile([Service] ICommunityService communionService, Guid userId)
        {
            return communionService.GetCommunityProfile(userId);
        }
    }
}
