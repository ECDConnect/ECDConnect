using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Tenancy.Context;
using ECDLink.Tenancy.Model;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class GenericQueryTypeExtension
    {
        private ContentManagementDbContext _context;

        public GenericQueryTypeExtension(ContentManagementDbContext context)
        {
            _context = context;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public TenantModel TenantContext()
        {
            return TenantExecutionContext.Tenant;
        }

        public List<Language> GetAllContentLanguages(string contentType)
        {
            var dynamicContentList = new List<Language>();

            var cTypes = _context.ContentTypes
              .Include(i => i.Content)
              .ThenInclude(ti => ti.ContentValues)
              .ThenInclude(ti => ti.ContentTypeField)
              .Where(x => x.Name == contentType)
              .FirstOrDefault();

            if (cTypes != null)
            {
                foreach (var item in cTypes.Content.Where(x => x.IsActive))
                {
                    foreach (var locale in item.ContentValues)
                    {
                        var lang = _context.Languages
                            .Where(x => x.IsActive && x.Id.Equals(locale.LocaleId)).FirstOrDefault();
                        if (!dynamicContentList.Contains(lang))
                            dynamicContentList.Add(lang);
                    }
                }
            }

            return dynamicContentList;
        }

    }
}
