using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.ContentManagement.Entities;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Tenancy.Context;
using ECDLink.Tenancy.Model;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Org.BouncyCastle.Math.EC.Rfc7748;
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
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            var dynamicContentList = new List<Language>();


            var cTypes = _context.ContentTypes
              .Include(i => i.Content)
              .ThenInclude(ti => ti.ContentValues)
              .ThenInclude(ti => ti.ContentTypeField)
              .Where(x => x.Name == contentType)
              .FirstOrDefault();


            //var contentTypeFields = _context.ContentTypes
            //    .Where(x => x.Name == contentType)
            //    .GroupJoin(_context.ContentTypeFields, ct => ct.Id, ctf => ctf.ContentTypeId, (ct, ctf) => ctf.Select(x => new { contentTypes = ct, ContentTypeField = ctf }).DefaultIfEmpty())
            //    //.GroupJoin(_context.ContentTypesFieldValues, ctff => ctff , ctfv => ctfv.ContentTypeFieldId, (ctf, ctfv) => ctfv.Select(y => new { ContentTypeFields = ctf, ContentTypesFieldValues = ctfv }).DefaultIfEmpty())
            //    .FirstOrDefault();

            //var contentTypeFieldss = _context.ContentTypes.Where(x => x.Name == contentType);





            //fr FromSqlRaw("SELECT distinct(L.Id),L.Locale FROM ContentValue CV LEFT JOIN Language L ON CV.LocaleId = L.Id LEFT JOIN ContentTypeField CTF on CTF.Id = CV.ContentTypeFieldId  WHERE CTF.DataLinkName = \"\" + type.Name + \"\"  AND \"TenantId\" = '" + tenantId + "'").AsQueryable();
            /*.ContentTypes      
            .fr
            //
           //.LeftJoin(_context.ContentTypesFieldValues,x => x.Id, y => y.co
          .Include(i => i.Content)//.Select(y => y.ContentTypeId))              
          //.Include(ti => ti.ContentValues.Select(y => y.ContentTypeId))
          .ThenInclude(ti => ti.ContentValues.Select(y => y.ContentTypeFieldId))
          .ThenInclude(ti2 => ti2)              
          .ThenInclude(i => i)
          .Where(x => x.Name == contentType)
          .FirstOrDefault();*/

            if (cTypes != null)
            {
                foreach (var item in cTypes.Content.Where(x => x.IsActive))
                {
                    foreach (var locale in item.ContentValues)
                    {
                        //var localeId = item.ContentValues.Select(y => y.LocaleId);
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
