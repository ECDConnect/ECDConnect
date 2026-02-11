using ECDLink.ContentManagement.Entities;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Tenancy.Context;
using HotChocolate.Data.Projections;
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

        public IQueryable<ContentType> GetAll()
        {
            // Can probably inject Id and fields
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            return _context.ContentTypes.Where(e => e.IsActive == true && (e.TenantId == null || e.TenantId == tenantId))
            //   .Include(x => x.Content.Where(f => f.IsActive))
                // .ThenInclude(x => x.ContentValues.Where(f => f.TenantId == tenantId))
                //   .ThenInclude(x => x.ContentTypeField)
              .Include(x => x.Fields.Where(f => f.IsActive))
                .ThenInclude(x => x.FieldType);
        }

        public Dictionary<int, List<Language>> GetAllLanguages(IEnumerable<int> contentTypes)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            var languages = _context.Languages
                        .Where(x => x.IsActive == true)
                        .OrderBy(l => l.TenantId)
                        .OrderByDescending(l => l.Locale)
                        .ToList();

            var languagesLookup = _context.ContentValues
                .Include(x => x.Content)
                .Where(e => contentTypes.Contains(e.Content.ContentTypeId)
                && e.TenantId == null || e.TenantId == tenantId)
                .Select(x => new { x.Content.ContentTypeId, x.LocaleId })
                .Distinct()
                .GroupBy(x => x.ContentTypeId)
                .ToDictionary(x => x.Key, x => x.Select(z => languages?.FirstOrDefault(l => l.Id == z.LocaleId)).ToList());
            return languagesLookup;
        }

        public ContentType GetById(int id)
        {
            // Can probably inject Id and fields
            return _context.ContentTypes
              .Include(x => x.Content)
                .ThenInclude(x => x.ContentValues)
                  .ThenInclude(x => x.ContentTypeField)
              .Include(x => x.Fields.Where(f => f.IsActive))
                .ThenInclude(x => x.FieldType)
                .Where(x => x.Id == id)
              .OrderBy(x => x.Id)
              .FirstOrDefault();
        }

        public async Task<bool> HasTranslations(int id, int ageGroup, Guid localId)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;

            var skillsFieldId = await _context.ContentTypeFields
                .Where(x => x.ContentTypeId == 37 && x.FieldName == "skills")
                .Select(x => x.Id)
                .FirstOrDefaultAsync();

            if (skillsFieldId == 0) return false;

            var skills = await _context.ContentValues
        .Where(x => x.ContentId == ageGroup
                 && x.ContentTypeFieldId == skillsFieldId
                 && x.TenantId == tenantId)
        .Select(x => x.Value)
        .FirstOrDefaultAsync();

            if (string.IsNullOrWhiteSpace(skills)) return false;

            var skillIds = skills
        .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
        .Select(s => int.TryParse(s, out int val) ? val : (int?)null)
        .Where(id => id.HasValue)
        .Select(id => id.Value)
        .Distinct()                    
        .ToList();

            if (!skillIds.Any()) return false;

            bool hasAnyTranslation = await _context.ContentValues
            .AnyAsync(x => x.TenantId == tenantId
                        && x.LocaleId == localId
                        && !string.IsNullOrEmpty(x.Value)
                        && skillIds.Contains(x.ContentId));

            return hasAnyTranslation;
        }

        public IQueryable<ContentType> GetAll(string search, bool searchInContent)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            IQueryable<ContentType> result = null;

            if (!string.IsNullOrWhiteSpace(search) && searchInContent == true)
            {
                var skipTypes = new List<string> { "image", "link", "staticLink", "color-picker", "video", "routineItems", "headerBanner", "imageUrl" };
                var keepTypeIds = _context.ContentTypeFields.Where(x => !skipTypes.Contains(x.FieldType.DataType)).Select(fieldType => fieldType.Id);
                var contentValues = _context.ContentValues
                    .Include(cv => cv.Content)
                        .ThenInclude(c => c.ContentType)
                            .ThenInclude(ct => ct.Fields.Where(f => f.IsActive))
                                .ThenInclude(f => f.FieldType)
                    .Where(cv => cv.Content.IsActive == true &&
                        (cv.TenantId == null
                            || cv.TenantId == tenantId
                        )
                        && EF.Functions.ILike(cv.Value, $"%{search}%")
                        && keepTypeIds.Contains(cv.ContentTypeFieldId))
                    .AsNoTracking().ToArray();

                var contents = contentValues.Select(cv => cv.Content);
                var contentTypes = contents.Select(cv => cv.ContentType);

                foreach (var ct in contentTypes)
                {
                    ct.Content = contents.Where(c => c.ContentTypeId == ct.Id).ToList();
                    foreach (var c in ct.Content)
                    {
                        c.ContentValues = contentValues.Where(cv => cv.ContentId == c.Id).ToList();
                    }
                }
                
                result = contentTypes.AsQueryable();
            }
            else
            {
                if (string.IsNullOrWhiteSpace(search))
                {
                    result = _context.ContentTypes
                                .Include(ct => ct.Content
                                    .Where(c => c.IsActive)
                                    .Where(c => c.ContentValues.Any(cv => cv.TenantId == tenantId))
                                )
                                    .ThenInclude(c => c.ContentValues
                                        .Where(cv => cv.TenantId == tenantId))
                                    .ThenInclude(cv => cv.ContentTypeField)
                                .Include(ct => ct.Fields.Where(f => f.IsActive))
                                    .ThenInclude(f => f.FieldType)
                                .Where(ct => 
                                    (ct.TenantId == null || ct.TenantId == tenantId) &&
                                    ct.IsActive &&
                                    ct.Content.Any(c => 
                                        c.ContentValues.Any(cv => cv.TenantId == tenantId))
                                )
                                .AsNoTracking()
                                .AsQueryable();
                }
                else
                {
                    result = _context.ContentTypes
                                .Include(ct => ct.Content
                                    .Where(c => c.IsActive)
                                    .Where(c => c.ContentValues.Any(cv => cv.TenantId == tenantId))
                                )
                                    .ThenInclude(c => c.ContentValues
                                        .Where(cv => cv.TenantId == tenantId))
                                    .ThenInclude(cv => cv.ContentTypeField)
                                .Include(ct => ct.Fields.Where(f => f.IsActive))
                                    .ThenInclude(f => f.FieldType)
                                .Where(ct =>
                                    (ct.TenantId == null || ct.TenantId == tenantId) &&
                                    ct.IsActive &&
                                    (EF.Functions.ILike(ct.Name, $"%{search}%")
                                    || EF.Functions.ILike(ct.Description, $"%{search}%")) &&
                                    ct.Content.Any(c =>
                                        c.ContentValues.Any(cv => cv.TenantId == tenantId))
                                    
                                )
                                .AsNoTracking()
                                .AsQueryable();
                }
            }
            return result;
        }
    }
}
