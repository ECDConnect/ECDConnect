using ECDLink.ContentManagement.Repositories;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ProgressTrackingCategoryMutationExtension
    {

        public bool BulkUpdateProgressTrackingCategoryImages(
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
                        { "imageUrl", imageUrl },
                    };

                    contentRepo.Update(contentId, id, connectDict);
                }
            }

            return true;

        }
    }
}
