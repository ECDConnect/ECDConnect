using DotLiquid;
using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.ContentManagement.Entities;
using ECDLink.ContentManagement.Repositories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.ContentManagement.GraphQL.Extensions
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ContentTypeQueryExtension
    {
        [UseSorting]
        [Permission(PermissionGroups.GENERAL, GraphActionEnum.View)]
        public IEnumerable<ContentType> GetContentTypes(
            [Service] ContentTypeRepository repository,
            string search = null,
            bool? searchInContent = null,
            bool? isVisiblePortal = null,
            PagedQueryInput pagingInput = null)
        {
            var tenantId = TenantExecutionContext.Tenant.Id;
            IQueryable<ContentType> request;
            
            if (search is not null || searchInContent is not null)
                request = repository.GetAll(search, searchInContent ?? false);
            else
                request = repository.GetAll();

            request = request.Where(c => c.IsActive == true);

            if (isVisiblePortal is not null)
                request = request.Where(c => c.IsVisiblePortal == isVisiblePortal);

            if (pagingInput is not null)
            {
                request = request.Skip(pagingInput.RowOffset).Take(pagingInput.PageSize ?? 10);
            }

            return request;
        }

        [Permission(PermissionGroups.GENERAL, GraphActionEnum.View)]
        public async Task<bool> GetHasContentTypeBeenTranslated([Service] ContentTypeRepository repository, int id, Guid localeId)
        {
            return await repository.HasTranslations(id, localeId);
        }
    }
}
