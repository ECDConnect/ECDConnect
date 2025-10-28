using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.ContentManagement.Repositories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.Portal
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class FormsMutationExtension
    {
        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.Update)]
        public bool UpdatePublishStatus(
            [Service] ContentManagementRepository contentRepo,
            string contentId,
            string isPublished)
        {
            var englishId = new Guid("9688cd08-adef-408c-9d34-5d75ae5c44df");
            Dictionary<string, object> updateDict = new Dictionary<string, object>
            {
                { "isPublished", isPublished },
                { "publishedDate", isPublished == "true" ? DateTime.Now.Date : ""}
            };
            contentRepo.Update(int.Parse(contentId), englishId, updateDict);
            return true;
        }
    }
}
