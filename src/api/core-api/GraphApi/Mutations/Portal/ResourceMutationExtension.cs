using EcdLink.Api.CoreApi.GraphApi.Models.Portal;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Services.Interfaces;
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
    public class ResourcesMutationExtension
    {
        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.Update)]
        public bool UpdateCaregiverResourceLink(
            [Service] ContentManagementRepository contentRepo,
            [Service] ILocaleService<Language> localeService,
            List<CMSResourceLinkModel> input,
            Guid localeId)
        {
            foreach (var item in input)
            {
                Dictionary<string, object> connectDict = new Dictionary<string, object>
                {
                    { "title", item.Title },
                    { "link", item.Link },
                    { "description", item.Description },
                };

                if (item.ContentId != -1)
                {
                    //update
                    contentRepo.Update(item.ContentId, localeId, connectDict);
                } else
                {
                    //insert
                    item.ContentId = contentRepo.Create(item.ContentTypeId, localeId, connectDict);
                }
            }

            return true;
        }

        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.Update)]
        public bool UpdateResourceConnectItem(
            [Service] ContentManagementRepository contentRepo,
            [Service] ILocaleService<Language> localeService,
            List<CMSConnectItemModel> input,
            Guid localeId)
        {
            foreach (var item in input)
            {
                Dictionary<string, object> connectDict = new Dictionary<string, object>
                {
                    { "buttonText", item.ButtonText },
                    { "link", item.Link },
                };

                if (item.ContentId != -1)
                {
                    //update
                    contentRepo.Update(item.ContentId, localeId, connectDict);
                }
                else
                {
                    //insert
                    item.ContentId = contentRepo.Create(item.ContentTypeId, localeId, connectDict);
                }
            }

            return true;
        }


        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.Delete)]
        public bool DeleteBulkResources(
            [Service] ContentManagementRepository contentRepo,
            [Service] ILocaleService<Language> localeService,
            List<CMSConnectItemModel> input,
            string localeId)
        {
            Guid languageId;
            if (Guid.TryParse(localeId, out languageId))
            {
                languageId = localeService.GetLocaleById(languageId)?.Id ?? Guid.Empty;
            }
            else
            {
                languageId = localeService.GetLocale(localeId)?.Id ?? Guid.Empty;
            }

            foreach (var item in input)
            {
                Dictionary<string, object> connectDict = new Dictionary<string, object>
                {
                    { "buttonText", item.ButtonText },
                    { "link", item.Link },
                };

                if (item.ContentId != -1)
                {
                    //update
                    contentRepo.Update(item.ContentId, languageId, connectDict);
                }
                else
                {
                    //insert
                    item.ContentId = contentRepo.Create(item.ContentTypeId, languageId, connectDict);
                }
            }

            return true;
        }


    }
}
