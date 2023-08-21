using ECDLink.ContentManagement.Entities;
using ECDLink.DataAccessLayer.Context;
using ECDLink.Tenancy.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.ContentManagement.Repositories
{
    public class ContentTypeRepository
    {
        private ContentManagementDbContext _context;

        public ContentTypeRepository(ContentManagementDbContext context)
        {
            _context = context;
        }

        public IQueryable<ContentType> GetAll()
        {
            // Can probably inject Id and fields
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            return _context.ContentTypes.Where(e => e.TenantId == null || e.TenantId.Equals(tenantId))
              .Include(x => x.Content)
                .ThenInclude(x => x.ContentValues)
                  .ThenInclude(x => x.ContentTypeField)
              .Include(x => x.Fields)
                .ThenInclude(x => x.FieldType);
        }

        public ContentType GetById(int id)
        {
            // Can probably inject Id and fields
            return _context.ContentTypes
              .Include(x => x.Content)
                .ThenInclude(x => x.ContentValues)
                  .ThenInclude(x => x.ContentTypeField)
              .Include(x => x.Fields)
                .ThenInclude(x => x.FieldType)
                .Where(x => x.Id == id)
              .OrderBy(x => x.Id)
              .FirstOrDefault();
        }

        public async Task<bool> HasTranslations(int id, Guid localId)
        {
            var contentType = await _context.ContentTypes
              .Include(x => x.Content)
                .ThenInclude(x => x.ContentValues)
                .Where(x => x.Id == id)
              .OrderBy(x => x.Id)
              .FirstOrDefaultAsync();

            var content = contentType.Content.Where(x => x.ContentValues.Any(z => z.LocaleId == localId)).OrderBy(x => x.Id).FirstOrDefault();

            return content != null ? true : false;
        }

        public IQueryable<ContentType> GetAll(string search, bool searchInContent)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            IQueryable<ContentType> result = null;

            if (searchInContent == true)
            {
                var contentValuesIds = _context.ContentValues.Where(cv =>
                    (cv.TenantId == null || cv.TenantId == tenantId)
                    && EF.Functions.ILike(cv.Value, $"%{search}%"))
                .Select(cv => cv.Id);

                result = _context.ContentTypes
                    .Include(x => x.Content)
                        .ThenInclude(x => x.ContentValues)
                            .ThenInclude(x => x.ContentTypeField)
                    .Include(x => x.Fields)
                        .ThenInclude(x => x.FieldType)
                    .Where(ct =>
                    (ct.TenantId == null || ct.TenantId == tenantId)
                    && ct.IsActive == true
                    && (EF.Functions.ILike(ct.Name, $"%{search}%")
                        || EF.Functions.ILike(ct.Description, $"%{search}%")
                        || ct.Content.Any(c => c.IsActive && c.ContentValues.Any(cv => contentValuesIds.Contains(cv.Id))))
                    );
            }
            else
            {
                result = _context.ContentTypes
                    .Include(x => x.Content)
                        .ThenInclude(x => x.ContentValues)
                            .ThenInclude(x => x.ContentTypeField)
                    .Include(x => x.Fields)
                        .ThenInclude(x => x.FieldType)
                    .Where(ct =>
                    (ct.TenantId == null || ct.TenantId == tenantId)
                    && ct.IsActive == true
                    && (EF.Functions.ILike(ct.Name, $"%{search}%")
                        || EF.Functions.ILike(ct.Description, $"%{search}%"))
                    );
            }
            return result;
        }
    }
}
