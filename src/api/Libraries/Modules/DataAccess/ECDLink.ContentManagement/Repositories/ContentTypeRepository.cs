using ECDLink.ContentManagement.Entities;
using ECDLink.DataAccessLayer.Context;
using ECDLink.Tenancy.Context;
using Microsoft.EntityFrameworkCore;
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

        public IEnumerable<ContentType> GetAll()
        {
            // Can probably inject Id and fields
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            return _context.ContentTypes.Where(e => e.TenantId == null || e.TenantId.Equals(tenantId))
              .Include(x => x.Content)
                .ThenInclude(x => x.ContentValues)
                  .ThenInclude(x => x.ContentTypeField)
              .Include(x => x.Fields)
                .ThenInclude(x => x.FieldType)
              .ToList();
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
              .FirstOrDefault();
        }

        public async Task<bool> HasTranslations(int id, Guid localId)
        {
            var contentType = await _context.ContentTypes
              .Include(x => x.Content)
                .ThenInclude(x => x.ContentValues)
                .Where(x => x.Id == id)
              .FirstOrDefaultAsync();

            var content = contentType.Content.Where(x => x.ContentValues.Any(z => z.LocaleId == localId)).FirstOrDefault();

            return content != null ? true : false;
        }
    }
}
