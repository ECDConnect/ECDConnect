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
    public class ConsentMutationExtension
    {

        [Permission(PermissionGroups.PORTAL, GraphActionEnum.Update)]
        public bool BulkUpdateConsentImages(
            [Service] ContentManagementRepository contentRepo,
            int contentId,
            int contentTypeId,
            Guid localeId,
            string imageUrl
            )
        {
            if (contentId == 0)
            {
                return false;
            }

            var languages = contentRepo.GetAllLanguagesForContentId(contentId, contentTypeId);

            foreach (var id in languages)
            {
                if (id != localeId)
                {
                    Dictionary<string, object> connectDict = new Dictionary<string, object>
                    {
                        { "image", imageUrl },
                    };

                    contentRepo.Update(contentId, id, connectDict);
                }
            }

            return true;

        }
    }
}
