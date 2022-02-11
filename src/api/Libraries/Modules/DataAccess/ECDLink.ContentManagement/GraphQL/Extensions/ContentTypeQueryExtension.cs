using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.ContentManagement.Entities;
using ECDLink.ContentManagement.Repositories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ECDLink.ContentManagement.GraphQL.Extensions
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ContentTypeQueryExtension
    {
        [Permission(PermissionGroups.GENERAL, GraphActionEnum.View)]
        public IEnumerable<ContentType> GetContentTypes([Service] ContentTypeRepository repository)
        {
            return repository.GetAll();
        }

        [Permission(PermissionGroups.GENERAL, GraphActionEnum.View)]
        public async Task<bool> GetHasContentTypeBeenTranslated([Service] ContentTypeRepository repository, int id, Guid localeId)
        {
            return await repository.HasTranslations(id, localeId);
        }
    }
}
