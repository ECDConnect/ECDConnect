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

            /*var cTypes = _context.ContentTypes
              .Include(i => i.Content)
              .ThenInclude(ti => ti.ContentValues)
              .ThenInclude(ti => ti.ContentTypeField)
              .Where(x => x.Name == contentType)
              .FirstOrDefault();*/
            var ctypes = _context.ContentTypes.Where(x => x.Name.Equals(contentType)).ToList();
            foreach (var ctype in ctypes) {
                var contents = _context.Contents.Where(x => x.ContentTypeId.Equals(ctype.Id)).ToList();
                foreach(var content in contents)
                {
                    var cvalues = _context.ContentTypesFieldValues.Where(x => x.ContentId.Equals(content.Id)).ToList();
                    foreach( var cvalue in cvalues)
                    {
                        var languages = _context.Languages.Where(x => x.Id.Equals(cvalue.LocaleId)).ToList();
                        foreach( var language in languages)
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
