using EcdLink.Api.CoreApi.GraphApi.Models.Community;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;

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
            return communionService.SaveCommunityProfile(input);
        }
    }
}
