using EcdLink.Api.CoreApi.GraphApi.Models.Community;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Community;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class CoachFeedbackMutationExtension
    {
        [Permission(PermissionGroups.COMMUNITY, GraphActionEnum.Create)]
        public CoachFeedback SaveCoachFeedback(
          [Service] ICommunityService communionService,
          CoachFeedbackInputModel input)
        {
            if (input == null)
            {
                throw new ArgumentException("input is empty");
            }

            return communionService.SaveCoachFeedback(input);
        }
    }
}
