using EcdLink.Api.CoreApi.GraphApi.Models;
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
    public class ConnectMutationExtension
    {
        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.Update)]
        public bool UpdateConnectSection(
            [Service] ContentManagementRepository contentRepo,
            [Service] ILocaleService<Language> localeService,
            List<CMSConnectModel> input,
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

            // First add add the connect sections, before adding the links
            foreach (var item in input)
            {
                Dictionary<string, object> connectDict = new Dictionary<string, object>
                {
                    { "name", item.Name },
                    { "type", item.Type },
                    { "hint", item.Hint }
                };

                if (item.ContentId != -1)
                {
                    //update
                    contentRepo.Update(item.ContentId, languageId, connectDict);
                } else
                {
                    //insert
                    item.ContentId = contentRepo.Create(item.ContentTypeId, languageId, connectDict);
                }

                foreach (var link in item.Links)
                {
                    Dictionary<string, object> connectItemDict = new Dictionary<string, object>
                    {
                        { "buttonText", link.ButtonText },
                        { "link", link.Link },
                        { "linkedConnect", item.ContentId },
                    };

                    if (link.ContentId != -1)
                    {
                        //update
                        contentRepo.Update(link.ContentId, languageId, connectItemDict);
                    }
                    else
                    {
                        //insert
                        contentRepo.Create(link.ContentTypeId, languageId, connectItemDict);
                    }
                }
            }

            return true;
        }

        
    }
}
