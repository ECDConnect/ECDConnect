using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Tenancy.Context;
using ECDLink.Tenancy.Model;
using HotChocolate;
using HotChocolate.Types;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class GenericQueryTypeExtension
    {
        public GenericQueryTypeExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public TenantModel TenantContext()
        {
            return new TenantModel(TenantExecutionContext.Tenant);
        }

        public List<Language> GetAllContentLanguages(
            [Service] ContentManagementDbContext _context, 
            string contentType)
        {
            var allContentTypeLocaleIds = _context.ContentTypes
                .Where(x => x.Name.Equals(contentType))
                .SelectMany(ct => ct.Content.SelectMany(c => c.ContentValues.Select(cv => cv.LocaleId)))
                .Distinct()
                .ToList();
            
            var languages = _context.Languages
                        .Where(x => allContentTypeLocaleIds.Contains(x.Id)
                            && x.TenantId == TenantExecutionContext.Tenant.Id)
                        .OrderBy(l => l.TenantId)
                        .OrderByDescending(l => l.Locale)
                        .ToList();

                languages = languages.Any() ? languages 
                            : _context.Languages
                                    .Where(x => allContentTypeLocaleIds.Contains(x.Id)
                                        && x.TenantId == null)
                                    .OrderBy(l => l.TenantId)
                                    .OrderByDescending(l => l.Locale)
                                    .ToList();
            return languages ?? new List<Language>();
        }

    }
}
