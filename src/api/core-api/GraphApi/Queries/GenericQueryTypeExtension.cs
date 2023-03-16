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
            return TenantExecutionContext.Tenant;
        }

        public List<Language> GetAllContentLanguages([Service] ContentManagementDbContext _context, string contentType)
        {
                var dynamicContentList = new List<Language>();
                var ctypes = _context.ContentTypes.Where(x => x.Name.Equals(contentType)).ToList();
                foreach (var ctype in ctypes)
                {
                    var contents = _context.Contents.Where(x => x.ContentTypeId.Equals(ctype.Id)).ToList();
                    foreach (var content in contents)
                    {
                        var cvalues = _context.ContentTypesFieldValues.Where(x => x.ContentId.Equals(content.Id)).ToList();
                        foreach (var cvalue in cvalues)
                        {
                            var languages = _context.Languages.Where(x => x.Id.Equals(cvalue.LocaleId)).ToList();
                            foreach (var language in languages)
                            {
                                if (!dynamicContentList.Contains(language))
                                    dynamicContentList.Add(language);
                            }

                        }
                    }
                }
                return dynamicContentList;
        }

    }
}
