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
            string[] showOnlyTypesWithName = null,
            int[] showOnlyTypesWithIds = null,
            bool? includeLanguages = null,
            PagedQueryInput pagingInput = null)
        {
            var tenantId = TenantExecutionContext.Tenant.Id;
            IQueryable<ContentType> request;
            
            if (!string.IsNullOrWhiteSpace(search) || searchInContent is not null)
                request = repository.GetAll(search, searchInContent ?? false);
            else
                request = repository.GetAll();

            if (showOnlyTypesWithName is not null && showOnlyTypesWithName.Length > 0)
                request = request.Where(x => showOnlyTypesWithName.Contains(x.Name));
            
            if (showOnlyTypesWithIds is not null && showOnlyTypesWithIds.Length > 0)
                request = request.Where(x => showOnlyTypesWithIds.Contains(x.Id));

            if (isVisiblePortal is not null)
                request = request.Where(c => c.IsVisiblePortal == isVisiblePortal);

            if (includeLanguages == true)
            {
                request = request.Include(ct => ct.Content).ThenInclude(c => c.ContentValues).ThenInclude(cv => cv.LocaleId);
            }

            if (pagingInput is not null)
            {
                request = request.Skip(pagingInput.RowOffset).Take(pagingInput.PageSize ?? 10);
            }

            return request;
        }

        [UseSorting]
        [Permission(PermissionGroups.GENERAL, GraphActionEnum.View)]
        public IEnumerable<ContentTypeWithLanguages> GetContentTypesWithLanguages(
            [Service] ContentTypeRepository repository,
            string search = null,
            bool? searchInContent = null,
            bool? isVisiblePortal = null,
            string[] showOnlyTypesWithName = null,
            int[] showOnlyTypesWithIds = null,
            PagedQueryInput pagingInput = null)
        {
            var tenantId = TenantExecutionContext.Tenant.Id;
            IQueryable<ContentType> request;

            if (!string.IsNullOrWhiteSpace(search) || searchInContent is not null)
                request = repository.GetAll(search, searchInContent ?? false);
            else
                request = repository.GetAll();

            request = request.Where(c => c.IsActive == true);

            if (showOnlyTypesWithName is not null && showOnlyTypesWithName.Length > 0)
                request = request.Where(x => showOnlyTypesWithName.Contains(x.Name));

            if (showOnlyTypesWithIds is not null && showOnlyTypesWithIds.Length > 0)
                request = request.Where(x => showOnlyTypesWithIds.Contains(x.Id));

            if (isVisiblePortal is not null)
                request = request.Where(c => c.IsVisiblePortal == isVisiblePortal);

            if (pagingInput is not null)
            {
                request = request.Skip(pagingInput.RowOffset).Take(pagingInput.PageSize ?? 10);
            }

            var contentTypes = request.ToList();
            var contentTypeIds = contentTypes.Select(ct => ct.Id);
            var languages = repository.GetAllLanguages(contentTypeIds);
            
            var theList = new List<ContentTypeWithLanguages>(contentTypes.Count);
            foreach (var ct in contentTypes)
            {
                var withLang = new ContentTypeWithLanguages(ct);
                withLang.Languages = languages.FirstOrDefault(l => l.Key == ct.Id).Value;
                theList.Add(withLang);
            }
            return theList;
        }

        [Permission(PermissionGroups.GENERAL, GraphActionEnum.View)]
        public async Task<bool> GetHasContentTypeBeenTranslated([Service] ContentTypeRepository repository, int id, Guid localeId)
        {
            return await repository.HasTranslations(id, localeId);
        }
    }
}
