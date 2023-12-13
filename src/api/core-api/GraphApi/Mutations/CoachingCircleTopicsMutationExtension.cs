using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.ContentManagement.Repositories;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class CoachingCircleTopicsMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Delete)]
        public BulkDeactivateResult BulkDeleteCoachingCircleTopics(
            [Service] ContentManagementRepository contentRepo,
            List<int> contentIds
            )
        {
            if (contentIds is null || contentIds.Count == 0)
            {
                return new BulkDeactivateResult();
            }

            var success = new List<string>();
            var failed = new List<string>();

            foreach (int contentId in contentIds)
            {
                bool deleteResult = contentRepo.Delete(contentId);
                if (deleteResult)
                {
                    success.Add(contentId.ToString());
                }
                else
                {
                    failed.Add(contentId.ToString());
                }
            }

            return new BulkDeactivateResult() { Failed = failed, Success = success };
        }
    }
}
