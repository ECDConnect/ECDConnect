using ECDLink.ContentManagement.Repositories;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.Portal
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class NatalMutationExtension
    {
        public bool AddNatalVideo(
            [Service] ContentManagementRepository contentRepo,
            string title,
            string section,
            string type,
            string video,
            Guid localeId,
            int contentTypeId
            )
        {
            Dictionary<string, object> dataDict = new Dictionary<string, object>
            {
                { "title", title },
                { "section", section },
                { "type", type },
                { "video", video },
                { "availableLanguages", Convert.ToString(localeId) },
            };

            contentRepo.Create(contentTypeId, localeId, dataDict);
            return true;
        }


        public bool AddNatalGraphic(
            [Service] ContentManagementRepository contentRepo,
            string title,
            string section,
            string type,
            string image,
            Guid localeId,
            int contentTypeId
            )
        {
            Dictionary<string, object> dataDict = new Dictionary<string, object>
            {
                { "title", title },
                { "section", section },
                { "type", type },
                { "image", image },
                { "availableLanguages", Convert.ToString(localeId) },
            };

            contentRepo.Create(contentTypeId, localeId, dataDict);
            return true;
        }

        public bool AddNatalInfo(
            [Service] ContentManagementRepository contentRepo,
            string title,
            string section,
            string type,
            string discussionA,
            string discussionB,
            string discussionC,
            string discussionD,
            string discussionE,
            string discussionF,
            string discussionG,
            string discussionH,
            string discussionI,
            string discussionJ,
            Guid localeId,
            int contentTypeId
            )
        {
            Dictionary<string, object> dataDict = new Dictionary<string, object>
            {
                { "title", title },
                { "section", section },
                { "type", type },
                { "discussionA", discussionA },
                { "discussionB", discussionB },
                { "discussionC", discussionC },
                { "discussionD", discussionD },
                { "discussionE", discussionE },
                { "discussionF", discussionF },
                { "discussionG", discussionG },
                { "discussionH", discussionH },
                { "discussionI", discussionI },
                { "discussionJ", discussionJ },
                { "availableLanguages", Convert.ToString(localeId) },
            };

            contentRepo.Create(contentTypeId, localeId, dataDict);
            return true;
        }
    }
}
