using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.ContentManagement.Repositories;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ProgrammeMutationExtension
    {
        [Permission(PermissionGroups.CONTENTTYPES, GraphActionEnum.Delete)]
        public BulkDeactivateResult BulkDeleteContentTypes(
            [Service] ContentManagementRepository contentRepo,
            List<int> contentIds)
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

        public bool BulkUpdateStoryBookThemes(
           [Service] ContentManagementRepository contentRepo,
           int contentId,
           int contentTypeId,
           Guid localeId,
           string themeIds
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
                        { "themes", themeIds },
                    };
                    contentRepo.Update(contentId, id, connectDict);
                }
            }
            return true;
        }

        public bool BulkUpdateActivityThemes(
           [Service] ContentManagementRepository contentRepo,
           int contentId,
           int contentTypeId,
           Guid localeId,
           string themeIds
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
                        { "themes", themeIds },
                    };
                    contentRepo.Update(contentId, id, connectDict);
                }
            }
            return true;
        }

    }
}
