using DotLiquid.Util;
using ECDLink.Abstractrions.Enums;
using ECDLink.ContentManagement.Constants;
using ECDLink.ContentManagement.Entities;
using ECDLink.Core.Caching.Configuration;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.EGraphQL.Constants;
using ECDLink.Tenancy.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.ContentManagement.Repositories
{
    public class ContentManagementRepository
    {
        private readonly ContentManagementDbContext _context;
        private AuthenticationDbContext _dbContext;
        private readonly IFileService _fileService;
        private readonly ILogger<ContentManagementRepository> _logger;
        private readonly IMemoryCache _memoryCache;
        private readonly IConfiguration _configuration;
        private readonly int _slidingExpiration = 10;
        private readonly int _absoluteExpiration = 60;

        public ContentManagementRepository(ContentManagementDbContext context, 
                                           IFileService fileService, 
                                           IMemoryCache memoryCache, 
                                           IConfiguration configuration, 
                                           ILogger<ContentManagementRepository> logger,
                                           AuthenticationDbContext dbContext)
        {
            _context = context;
            _dbContext= dbContext;
            _fileService = fileService;
            _logger = logger;
            _memoryCache = memoryCache;
            _configuration = configuration;
            var cachingConfig = _configuration.GetSection<CachingSection>(CachingSection.Name);
            if (cachingConfig != null && cachingConfig.Content != null)
            {
                _slidingExpiration = cachingConfig.Content.SlidingExpiration;
                _absoluteExpiration = cachingConfig.Content.AbsoluteExpiration;
            }
        }

        private MemoryCacheEntryOptions GetCacheOptions()
        {
            var cacheEntryOptions = new MemoryCacheEntryOptions();
            if (_slidingExpiration > 0) cacheEntryOptions.SetSlidingExpiration(TimeSpan.FromSeconds(_slidingExpiration));
            if (_absoluteExpiration > 0) cacheEntryOptions.SetAbsoluteExpiration(TimeSpan.FromSeconds(_absoluteExpiration));
            return cacheEntryOptions;
        }

        public IEnumerable<object> GetAll(int contentTypeId, Guid localeId)
        {
            var currentTenant = TenantExecutionContext.Tenant.Id;

            if (localeId == Guid.Empty)
            {
                var deafultLocale = _context.Languages
                .Where(x => x.Locale == "en-za")
                .FirstOrDefault();

                localeId = deafultLocale.Id;
            }

            List<object> results = null;

            string key = string.Format("Content.{0}.{1}.{2}.All", currentTenant, contentTypeId, localeId);
            if (!_memoryCache.TryGetValue<List<Object>>(key, out results))
            {
                _logger.LogDebug("Fetching from DB: {0}", key);
                // Get the complete content for null tenant and current tenants.
                var contentType = _context.ContentTypes
                  .Include(ct => ct.Content.Where(x => x.IsActive))
                      .ThenInclude(c => c.ContentValues.Where(c => c.LocaleId == localeId && (c.TenantId == currentTenant || c.TenantId == null)))
                        .ThenInclude(c => c.ContentTypeField)
                  .Where(x => x.Id == contentTypeId
                        && x.IsActive
                        // Can't have duplicates in ContentType as they get added
                        // to HotChocolate and it throws, so can just request both.
                        && (x.TenantId == currentTenant || x.TenantId == null))
                  .OrderByDescending(x => x.TenantId)
                  .ThenBy(x => x.Id)
                  .FirstOrDefault();

                var contents = contentType?.Content
                        .Where(x => x.IsActive && x.ContentValues.Any())
                        .OrderBy(x => x.Id)
                        .ToList();

                // Use global tenant as a fallback, mostly for static and dynamic links
                contents = (contents?.Any() ?? false) ? contents
                    : contentType?.Content
                        .Where(x => x.IsActive
                                && x.TenantId == null)
                        .OrderBy(x => x.Id)
                        .ToList();

                // No Content Found
                if (contents == default)
                {
                    var errorMessage = "Could not find any 'Content' for ContentTypeId: {contentTypeId}.";
                    _logger.LogWarning(errorMessage, contentTypeId);
                }

                var allContentValuePairs = new List<object>();

                foreach (var item in contents ?? new List<Content>())
                {
                    // keep our tenant's content values and fill in the gaps with the global tenant's content values
                    // Get the ContentValues for the current tenant, or the global tenant.
                    var noTenantContenValues = item.ContentValues
                         .Where(x => x.LocaleId == localeId
                                 && x.ContentTypeField.IsActive == true
                                 && (x.TenantId == null))
                         .Select(y => new { y.Id, y.ContentTypeField, y.Value, y.ContentId })
                         .OrderBy(cv => cv?.ContentTypeField?.FieldOrder ?? cv?.ContentId)
                         .ToList();

                    var contentValues = item.ContentValues
                     .Where(x => x.LocaleId == localeId
                             && x.ContentTypeField.IsActive == true
                             && (x.TenantId == TenantExecutionContext.Tenant.Id))
                     .Select(y => new { y.Id, y.ContentTypeField, y.Value, y.ContentId })
                     .OrderBy(cv => cv?.ContentTypeField?.FieldOrder ?? cv?.ContentId)
                     .ToList();

                    //var allContents = contentValues.Union(noTenantContenValues).ToList();
                    // Union just merges the two lists and no duplicates.  With ContentValues.Id in the object, it will never be duplicates.


                    var mergedContentValues = contentValues.ToDictionary(cv => new { cv.ContentTypeField, cv.ContentId });
                    foreach (var ntcv in noTenantContenValues)
                    {
                        var ntcvKey = new { ntcv.ContentTypeField, ntcv.ContentId };
                        if (!mergedContentValues.ContainsKey(ntcvKey))
                        {
                            mergedContentValues.Add(ntcvKey, ntcv);
                        }
                    }
                    contentValues = mergedContentValues.Values.OrderBy(cv => cv?.ContentTypeField?.FieldOrder ?? cv?.ContentId).ToList();

                    // Ignore the TenantId on ContentTypeField because HotChocolate doesn't allow duplicate names.
                    var contentFieldValuePairs = contentValues.ToDictionary(k => k.ContentTypeField.FieldName, v => v.Value);
                    contentFieldValuePairs.Add(ObjectFieldConstants.Identifier, item.Id.ToString());
                    if (!contentFieldValuePairs.ContainsKey("updatedDate"))
                    {
                        contentFieldValuePairs.Add("updatedDate", item.UpdatedDate.ToString());
                    }
                    else
                    {
                        contentFieldValuePairs["updatedDate"] = item.UpdatedDate.ToString();
                    }
                    if (item.ContentValues.Any(x => x.ContentTypeField.FieldName == "availableLanguages"))
                    {
                        var langsList = this.GetAllLanguagesForContentId(item.Id, item.ContentTypeId);
                        if (!contentFieldValuePairs.ContainsKey("availableLanguages"))
                        {
                            //add list if non existent
                            contentFieldValuePairs.Add("availableLanguages", string.Join(",", langsList));
                        }
                        else
                        {
                            //update with fulllist
                            contentFieldValuePairs["availableLanguages"] = string.Join(",", langsList);
                        }
                    }
                    contentFieldValuePairs["tenantId"] = item.ContentValues.Select(x => x.TenantId.ToString()).FirstOrDefault();
                    if (contentFieldValuePairs?.Any() ?? false)
                    {
                        allContentValuePairs.Add(contentFieldValuePairs.ToObject());
                    }
                }

                results = allContentValuePairs;

                _memoryCache.Set(key, results, GetCacheOptions());
            }
            else
            {
                _logger.LogDebug("Fetching from CACHE: {0}", key);
            }
            return results;
        }

        public object GetById(int contentId, Guid localeId)
        {
            var currentTenant = TenantExecutionContext.Tenant.Id;

            object result;

            var key = string.Format("Content.{0}.{1}..Id.{2}", currentTenant, localeId, contentId);
            if (!_memoryCache.TryGetValue<object>(key, out result))
            {
                // Try get tenant data
                var content = _context.Contents
                            .Include(i => i.ContentType)
                            .Include(i => i.ContentValues)
                                .ThenInclude(ti => ti.ContentTypeField)
                            .Where(x => x.Id == contentId
                                    && x.IsActive
                                    && x.TenantId == currentTenant)
                            .OrderBy(x => x.Id)
                            .FirstOrDefault();

                // Use global tenant as a fallback, mostly for static and dynamic links
                content ??= _context.Contents
                        .Include(i => i.ContentType)
                        .Include(i => i.ContentValues)
                            .ThenInclude(ti => ti.ContentTypeField)
                        .Where(x => x.Id == contentId
                            && x.IsActive
                            && x.TenantId == null)
                        .OrderBy(x => x.Id)
                        .FirstOrDefault();

                // No Content Found
                if (content == default)
                {
                    var errorMessage = "Could not find any 'Content' with Id: {contentId}.";
                    _logger.LogWarning(errorMessage, contentId);
                }

                var contentValuesList = content.ContentValues
                                .Where(x => x.LocaleId == localeId
                                    && x.TenantId == currentTenant)
                                .OrderByDescending(x => x.UpdatedDate)
                                .ThenBy(x => x.ContentTypeField?.FieldOrder)
                                .ToList();
          
                // keep our tenant's content values and fill in the gaps with the global tenant's content values
                // Get the ContentValues for the current tenant, or the global tenant.
                var noTenantContenValues = content.ContentValues
                     .Where(x => x.LocaleId == localeId
                             && x.ContentTypeField.IsActive == true
                             && (x.TenantId == null))
                     .Select(y => new { y.Id, y.ContentTypeField, y.Value, y.ContentId })
                     .OrderBy(cv => cv?.ContentTypeField?.FieldOrder ?? cv?.ContentId)
                     .ToList();

                var contentValues = content.ContentValues
                 .Where(x => x.LocaleId == localeId
                         && x.ContentTypeField.IsActive == true
                         && (x.TenantId == TenantExecutionContext.Tenant.Id))
                 .Select(y => new { y.Id, y.ContentTypeField, y.Value, y.ContentId })
                 .OrderBy(cv => cv?.ContentTypeField?.FieldOrder ?? cv?.ContentId)
                 .ToList();

                var mergedContentValues = contentValues.ToDictionary(cv => new { cv.ContentTypeField, cv.ContentId });
                foreach (var ntcv in noTenantContenValues)
                {
                    var ntcvKey = new { ntcv.ContentTypeField, ntcv.ContentId };
                    if (!mergedContentValues.ContainsKey(ntcvKey))
                    {
                        mergedContentValues.Add(ntcvKey, ntcv);
                    }
                }
                contentValues = mergedContentValues.Values.OrderBy(cv => cv?.ContentTypeField?.FieldOrder ?? cv?.ContentId).ToList();

                var dict = contentValues.ToDictionary(k => k.ContentTypeField.FieldName, v => v.Value);

                dict.Add(ObjectFieldConstants.Identifier, content.Id.ToString());
                if (!dict.ContainsKey("updatedDate"))
                {
                    dict.Add("updatedDate", contentValuesList.TryGetAtIndex(0).UpdatedDate.ToString());
                }

                result = dict.ToObject();

                _memoryCache.Set(key, result, GetCacheOptions());
            }
            return result;
        }

        public List<Guid> GetAllLanguagesForContentId(int contentId, int contentTypeId)
        {
            var currentTenant = TenantExecutionContext.Tenant.Id;

            List<Guid> results;

            var key = string.Format("Content.{0}.{1}.{2}.AllLanguages", currentTenant, contentTypeId, contentId);
            if (!_memoryCache.TryGetValue<List<Guid>>(key, out results))
            {
                var content = _context.Contents
                            .Include(i => i.ContentValues)
                            .Where(x => x.Id == contentId
                                    && x.IsActive
                                    && x.ContentTypeId == contentTypeId
                                    && x.TenantId == currentTenant)
                            .FirstOrDefault();

                // Use global tenant as a fallback, mostly for static and dynamic links
                content ??= _context.Contents
                        .Include(i => i.ContentValues)
                        .Where(x => x.Id == contentId
                            && x.IsActive
                            && x.ContentTypeId == contentTypeId
                            && x.TenantId == null)
                        .OrderBy(x => x.Id)
                        .FirstOrDefault();

                results = content.ContentValues.Select(x => x.LocaleId).Distinct().ToList();

                _memoryCache.Set(key, results, GetCacheOptions());
            }
            return results;
        }

        public ContentType GetContentTypeForContentId(int contentId)
        {
            var currentTenant = TenantExecutionContext.Tenant.Id;
            var content = _context.Contents
                .Include(i => i.ContentType)
                            .Where(x => x.Id == contentId
                                    && x.IsActive
                                    && x.TenantId == currentTenant)
                            .FirstOrDefault();
            if (content == null || content == default)
            {
                return null;
            }
            return content.ContentType;
        }

        public IEnumerable<object> GetByIds(int contentTypeId, Guid localeId, params int[] contentIds)
        {
            var currentTenant = TenantExecutionContext.Tenant.Id;

            List<object> results = null;

            string key = string.Format("Content.{0}.{1}.{2}.Ids.{3}", currentTenant, contentTypeId, localeId, string.Join(',', contentIds));
            if (!_memoryCache.TryGetValue<List<Object>>(key, out results))
            {
                _logger.LogDebug("Fetching from DB: {0}", key);
                // TODO: Do we need to selectively skip the IsActive check?
                var content = _context.Contents
                            .Include(i => i.ContentType)
                            .Include(i => i.ContentValues)
                            .ThenInclude(ti => ti.ContentTypeField)
                            .Where(x => contentIds.Contains(x.Id)
                                && x.IsActive
                                && x.TenantId == currentTenant)
                            .OrderBy(c => c.Id)
                            .ToList();

                // Use global tenant as a fallback, mostly for static and dynamic links
                content = content?.Any() ?? false ? content
                        : _context.Contents
                                .Include(i => i.ContentType)
                                .Include(i => i.ContentValues)
                                .ThenInclude(ti => ti.ContentTypeField)
                                .Where(x => contentIds.Contains(x.Id)
                                    && x.IsActive
                                    && x.TenantId == null)
                                .OrderBy(c => c.Id)
                                .ToList();

                //No Content Found
                if (content == default || !content.Any())
                {
                    var errorMessage = "Could not find any 'Content' with Ids:";
                    _logger.LogWarning($"{errorMessage} {{contentIds}}.", contentIds);
                }

                var dynamicContentList = new List<object>();

                foreach (var item in content)
                {
                    var noTenantContenValues = item.ContentValues
                        .Where(x => x.LocaleId == localeId
                                && x.ContentTypeField.IsActive == true
                                && (x.TenantId == null))
                        .Select(y => new { y.Id, y.ContentTypeField,y.Value, y.ContentId })
                        .OrderBy(cv => cv?.ContentTypeField?.FieldOrder ?? cv?.ContentId)
                        .ToList();

                    var contentValues = item.ContentValues
                     .Where(x => x.LocaleId == localeId
                             && x.ContentTypeField.IsActive == true
                             && (x.TenantId == TenantExecutionContext.Tenant.Id))
                     .Select(y => new { y.Id, y.ContentTypeField, y.Value, y.ContentId })
                     .OrderBy(cv => cv?.ContentTypeField?.FieldOrder ?? cv?.ContentId)
                     .ToList();

                    //var allContents = contentValues.Union(noTenantContenValues).ToList();
                    // Union just merges the two lists and no duplicates.  With ContentValues.Id in the object, it will never be duplicates.


                    var mergedContentValues = contentValues.ToDictionary(cv => new { cv.ContentTypeField, cv.ContentId });
                    foreach (var ntcv in noTenantContenValues)
                    {
                        var ntcvKey = new { ntcv.ContentTypeField, ntcv.ContentId };
                        if (!mergedContentValues.ContainsKey(ntcvKey))
                        {
                            mergedContentValues.Add(ntcvKey, ntcv);
                        }
                    }
                    contentValues = mergedContentValues.Values.OrderBy(cv => cv?.ContentTypeField?.FieldOrder ?? cv?.ContentId).ToList();

                    // TODO: Use .Query() to get the data in one query?
                    var objDict = contentValues.ToDictionary(k => k.ContentTypeField.FieldName, v => v.Value);

                    objDict.Add(ObjectFieldConstants.Identifier, item.Id.ToString());
                    dynamicContentList.Add(objDict.ToObject());
                }

                results = dynamicContentList;
                _memoryCache.Set(key, results, GetCacheOptions());
            }
            else
            {
                _logger.LogDebug("Fetching from CACHE: {0}", key);
            }
            return results;
        }

        public IEnumerable<object> GetByValueKey(string contentType, string key, string value, Guid localeId)
        {
            var content = _context.Contents
                    .Include(i => i.ContentType)
                    .Include(i => i.ContentValues)
                        .ThenInclude(ti => ti.ContentTypeField)
                    .Where(x => x.TenantId == TenantExecutionContext.Tenant.Id
                            && x.ContentType.Name == contentType
                            && x.IsActive
                            && x.ContentValues.Any(y => y.LocaleId == localeId)
                            && x.ContentValues.Any(y => y.ContentTypeField.FieldName == key)
                            && x.ContentValues.Any(y => y.Value == value)
                            && x.ContentValues.Any(y => y.TenantId == TenantExecutionContext.Tenant.Id)
                            )
                    .ToList();

            // Use global tenant as a fallback, mostly for static and dynamic links
            content = content?.Any() ?? false ? content
                    : _context.Contents
                        .Include(i => i.ContentType)
                        .Include(i => i.ContentValues)
                            .ThenInclude(ti => ti.ContentTypeField)
                        .Where(x => x.TenantId == null
                                && x.ContentType.Name == contentType
                                && x.IsActive
                                && x.ContentValues.Any(y => y.LocaleId == localeId)
                                && x.ContentValues.Any(y => y.ContentTypeField.FieldName == key)
                                && x.ContentValues.Any(y => y.Value == value)
                                && x.ContentValues.Any(y => y.TenantId == TenantExecutionContext.Tenant.Id)
                                )
                        .ToList();

            // No Content Found
            if (content == default || !content.Any())
            {
                var errorMessage = "Could not find 'ContentType' with Name, key or value: {contentType}, {key}, {value}.";
                _logger.LogWarning(errorMessage, contentType.ToString(), key, value);
            }

            var allContentValuePairs = new List<object>();

            foreach (var item in content)
            {
                var contentValues = item.ContentValues
                    .Where(x => x.LocaleId == localeId
                            && x.ContentTypeField.IsActive == true
                            && (x.TenantId == TenantExecutionContext.Tenant.Id))
                    .OrderBy(cv => cv?.ContentTypeField?.FieldOrder ?? cv?.ContentId)
                    .ToList();
                if (contentValues.Count == 0) {
                    contentValues = item.ContentValues
                    .Where(x => x.LocaleId == localeId
                            && x.ContentTypeField.IsActive == true
                            && (x.TenantId == null))
                    .OrderBy(cv => cv?.ContentTypeField?.FieldOrder ?? cv?.ContentId)
                    .ToList();
                }

                var contentFieldValuePairs = contentValues.ToDictionary(k => k.ContentTypeField.FieldName, v => v.Value);
                contentFieldValuePairs.Add(ObjectFieldConstants.Identifier, item.Id.ToString());
                if (!contentFieldValuePairs.ContainsKey("updatedDate"))
                {
                    contentFieldValuePairs.Add("updatedDate", item.UpdatedDate.ToString());
                }
                else
                {
                    contentFieldValuePairs["updatedDate"] = item.UpdatedDate.ToString();
                }
                var langsList = this.GetAllLanguagesForContentId(item.Id, item.ContentTypeId);
                if (!contentFieldValuePairs.ContainsKey("availableLanguages"))
                {
                    //add list if non existent
                    contentFieldValuePairs.Add("availableLanguages", string.Join(",", langsList));
                }
                else
                {
                    //update with fulllist
                    contentFieldValuePairs["availableLanguages"] = string.Join(",", langsList);
                }
                if ((contentType == ContentTypeConstants.Consent || contentType == ContentTypeConstants.MoreInformation) && 
                    (contentFieldValuePairs.ContainsKey("description")) || contentFieldValuePairs.ContainsKey("descriptionA")
                    )
                {
                    if (contentFieldValuePairs.ContainsKey("description"))
                    {
                        contentFieldValuePairs["description"] = contentFieldValuePairs["description"].Replace("[organisationName]", TenantExecutionContext.Tenant.OrganisationName);
                        contentFieldValuePairs["description"] = contentFieldValuePairs["description"].Replace("[applicationName]", TenantExecutionContext.Tenant.ApplicationName);
                    }
                    if (contentFieldValuePairs.ContainsKey("descriptionA"))
                    {
                        contentFieldValuePairs["descriptionA"] = contentFieldValuePairs["descriptionA"].Replace("[organisationName]", TenantExecutionContext.Tenant.OrganisationName);
                        contentFieldValuePairs["descriptionA"] = contentFieldValuePairs["descriptionA"].Replace("[applicationName]", TenantExecutionContext.Tenant.ApplicationName);
                    }
                }
                if (!contentFieldValuePairs.ContainsKey("insertedDate"))
                {
                    contentFieldValuePairs.Add("insertedDate", item.InsertedDate.ToString());
                }
                else
                {
                    contentFieldValuePairs["insertedDate"] = item.InsertedDate.ToString();
                }
                if (contentFieldValuePairs?.Any() ?? false)
                {
                    allContentValuePairs.Add(contentFieldValuePairs.ToObject());
                }
            }

            return allContentValuePairs;
        }

        public IEnumerable<object> GetAllTranslations(string contentType, string key, string value, string toTranslate)
        {
            var content = _context.Contents
                    .Include(i => i.ContentType)
                    .Include(i => i.ContentValues)
                        .ThenInclude(ti => ti.ContentTypeField)
                    .Where(x => x.TenantId == TenantExecutionContext.Tenant.Id
                            && x.ContentType.Name == contentType
                            && x.IsActive
                            && x.ContentValues.Any(y => y.ContentTypeField.FieldName == key)
                            && x.ContentValues.Any(y => y.Value == value))
                    .ToList();

            // Use global tenant as a fallback, mostly for static and dynamic links
            content = content?.Any() ?? false ? content
                    : _context.Contents
                        .Include(i => i.ContentType)
                        .Include(i => i.ContentValues)
                            .ThenInclude(ti => ti.ContentTypeField)
                        .Where(x => x.TenantId == null
                                && x.ContentType.Name == contentType
                                && x.IsActive
                                && x.ContentValues.Any(y => y.ContentTypeField.FieldName == key)
                                && x.ContentValues.Any(y => y.Value == value))
                        .ToList();

            var allContentValuePairs = new List<object>();

            foreach (var item in content)
            {
                var contentValues = item.ContentValues
                    .Where(x => x.ContentTypeField.IsActive == true
                            && (x.TenantId == TenantExecutionContext.Tenant.Id || x.TenantId == null)
                            && x.ContentTypeField.FieldName == toTranslate)
                    .OrderBy(cv => cv?.ContentTypeField?.FieldOrder ?? cv?.ContentId)
                    .ToList();

                var contentFieldValuePairs = contentValues.ToDictionary(k => k.LocaleId.ToString(), v => v.Value);
                if (contentFieldValuePairs?.Any() ?? false)
                {
                    allContentValuePairs.Add(contentFieldValuePairs.ToObject());
                }
            }

            return allContentValuePairs;
        }


        public IEnumerable<object> GetContentByTitleAndSection(string contentType, string section, Guid localeId, string title)
        {
            var contentQuery = _context.Contents
                    .Include(i => i.ContentType)
                    .Include(i => i.ContentValues)
                        .ThenInclude(ti => ti.ContentTypeField)
                    .Where(x => x.TenantId == TenantExecutionContext.Tenant.Id
                            && x.ContentType.Name == contentType
                            && x.IsActive
                            && x.ContentValues.Any(y => y.LocaleId == localeId)
                            && x.ContentValues.Any(y => y.ContentTypeField.FieldName == "title")
                            && x.ContentValues.Any(y => y.Value == section));

            if (title != null && title != "")
            {
                contentQuery = contentQuery.Where(x => x.ContentValues.Any(y => y.ContentTypeField.FieldName == "section")
                                                    && x.ContentValues.Any(y => y.Value == title));
            }


            var content = contentQuery.ToList();

            // Use global tenant as a fallback, mostly for static and dynamic links
            contentQuery = content?.Any() ?? false ? contentQuery
                    : _context.Contents
                        .Include(i => i.ContentType)
                        .Include(i => i.ContentValues)
                            .ThenInclude(ti => ti.ContentTypeField)
                        .Where(x => x.TenantId == null
                                && x.ContentType.Name == contentType
                                && x.IsActive
                                && x.ContentValues.Any(y => y.LocaleId == localeId)
                                && x.ContentValues.Any(y => y.ContentTypeField.FieldName == "title")
                                && x.ContentValues.Any(y => y.Value == section));

            if (title != null && title != "")
            {
                contentQuery = contentQuery.Where(x => x.ContentValues.Any(y => y.ContentTypeField.FieldName == "section")
                                                    && x.ContentValues.Any(y => y.Value == title));
            }

            content = contentQuery.ToList();

            // No Content Found
            if (content == default || !content.Any())
            {
                var errorMessage = "Could not find 'ContentType' with Name, key or value: {contentType}, {key}, {value}.";
                _logger.LogWarning(errorMessage, contentType.ToString(), "title", title);
            }

            var allContentValuePairs = new List<object>();

            foreach (var item in content)
            {
                var contentValues = item.ContentValues
                    .Where(x => x.LocaleId == localeId
                            && x.ContentTypeField.IsActive == true
                            && (x.TenantId == TenantExecutionContext.Tenant.Id || x.TenantId == null))
                    .OrderBy(cv => cv?.ContentTypeField?.FieldOrder ?? cv?.ContentId)
                    .ToList();

                var contentFieldValuePairs = contentValues.ToDictionary(k => k.ContentTypeField.FieldName, v => v.Value);
                contentFieldValuePairs.Add(ObjectFieldConstants.Identifier, item.Id.ToString());
                if (!contentFieldValuePairs.ContainsKey("updatedDate"))
                {
                    contentFieldValuePairs.Add("updatedDate", item.UpdatedDate.ToString());
                }
                else
                {
                    contentFieldValuePairs["updatedDate"] = item.UpdatedDate.ToString();
                }
                var langsList = this.GetAllLanguagesForContentId(item.Id, item.ContentTypeId);
                if (!contentFieldValuePairs.ContainsKey("availableLanguages"))
                {
                    //add list if non existent
                    contentFieldValuePairs.Add("availableLanguages", string.Join(",", langsList));
                }
                else
                {
                    //update with fulllist
                    contentFieldValuePairs["availableLanguages"] = string.Join(",", langsList);
                }

                if (contentFieldValuePairs?.Any() ?? false)
                {
                    allContentValuePairs.Add(contentFieldValuePairs.ToObject());
                }
            }

            return allContentValuePairs;
        }

        public int Create(int contentTypeId, Guid localeId, IDictionary<string, object> input)
        {
            var contentType = _context.ContentTypes
                                .Include(i => i.Fields)
                                .Where(x => x.Id == contentTypeId
                                    // Need to select both null and current tenant as some types are shared.
                                    && (x.TenantId == TenantExecutionContext.Tenant.Id || x.TenantId == null))
                                .OrderByDescending(x => x.TenantId)
                                .ThenBy(x => x.Id)
                                .FirstOrDefault();

            // No Content Found
            if (contentType == default)
            {
                var errorMessage = "Could not find ContentType with Id: {contentTypeId}.";
                _logger.LogWarning(errorMessage, contentTypeId.ToString());
            }

            var fieldList = contentType.Fields.Where(x => x.IsActive);

            var contentValues = new List<ContentValue>();

            foreach (var field in fieldList)
            {
                if (input.TryGetValue(field.FieldName, out var value))
                {
                    // if we get the string base64 in the value we know it is a file upload 
                    // note: this is being done because the field type is not useful.
                    var fileIndex = value?.ToString()?.IndexOf("base64");

                    if (fileIndex != null && fileIndex != -1)
                    {
                        var fileUrl = uploadFile(value?.ToString(), field.FieldName);
                        contentValues.Add(new ContentValue
                        {
                            Value = fileUrl,
                            ContentTypeFieldId = field.Id,
                            LocaleId = localeId,
                            TenantId = TenantExecutionContext.Tenant.Id,
                            InsertedDate = DateTime.UtcNow,
                            UpdatedDate = DateTime.UtcNow
                        });

                    }
                    else
                    {
                        contentValues.Add(new ContentValue
                        {
                            Value = field.FieldName != "availableLanguages" ? value?.ToString() : localeId.ToString(),
                            ContentTypeFieldId = field.Id,
                            LocaleId = localeId,
                            TenantId = TenantExecutionContext.Tenant.Id,
                            InsertedDate = DateTime.UtcNow,
                            UpdatedDate = DateTime.UtcNow
                        });
                    }
                }
            }

            var newContent = new Content
            {
                ContentTypeId = contentTypeId,
                ContentValues = contentValues,
                IsActive = true,
                //TenantId = TenantExecutionContext.Tenant.Id,
                InsertedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            };

            _context.Contents.Add(newContent);

            _context.SaveChanges();

            return newContent.Id;
        }

        private string getFileType(string fileStr)
        {
            var fileExt = "";

            if (fileStr.ToLower().Contains("svg"))
            {
                fileExt = ".svg";
            }
            if (fileStr.ToLower().Contains("png"))
            {
                fileExt = ".png";
            }
            if (fileStr.ToLower().Contains("jpg") || fileStr.ToLower().Contains("jpeg"))
            {
                fileExt = ".jpg";
            }
            if (fileStr.ToLower().Contains("mov"))
            {
                fileExt = ".mov";
            }
            if (fileStr.ToLower().Contains("mkv"))
            {
                fileExt = ".mkv";
            }
            if (fileStr.ToLower().Contains("m4v"))
            {
                fileExt = ".m4v";
            }
            if (fileStr.ToLower().Contains("mp4"))
            {
                fileExt = ".mp4";
            }
            if (fileStr.ToLower().Contains("mpg"))
            {
                fileExt = ".mpg";
            }
            if (fileStr.ToLower().Contains("webm"))
            {
                fileExt = ".webm";
            }
            if (fileStr.ToLower().Contains("pdf"))
            {
                fileExt = ".pdf";
            }
            return fileExt;
        }

        private string uploadFile(string fileStr, string fieldName)
        {
            var b64Str = fileStr.Substring(fileStr.LastIndexOf(',') + 1);
            var bytes = Convert.FromBase64String(b64Str);
            using MemoryStream fileStream = new MemoryStream(bytes);

            var fileName = DateTime.Now.Ticks + "_" + fieldName + getFileType(fileStr.Substring(0, fileStr.LastIndexOf(',')));
            var fileUrl = Task.Run(() => _fileService.UploadFileStreamAsync(fileStream, fileName, FileTypeEnum.ContentImage)).Result;
            fileStream.Dispose();

            return fileUrl.ToString();
        }

        public object Update(int contentId, Guid localeId, IDictionary<string, object> input)
        {
            // Can probably inject Id and fields
            Guid? currentTenantId = TenantExecutionContext.Tenant.Id;

            var content = _context.Contents
                            .Include(i => i.ContentType)
                                .ThenInclude(ti => ti.Fields)
                            .Include(i => i.ContentValues)
                                .ThenInclude(ti => ti.ContentTypeField)
                            .Where(x => x.Id == contentId
                                    && x.IsActive
                                    && x.TenantId == currentTenantId)
                            .OrderBy(x => x.Id)
                            .FirstOrDefault();

            // Use global tenant as a fallback, mostly for static and dynamic links            
            content ??= _context.Contents
                            .Include(i => i.ContentType)
                                .ThenInclude(ti => ti.Fields)
                            .Include(i => i.ContentValues)
                                .ThenInclude(ti => ti.ContentTypeField)
                            .Where(x => x.Id == contentId
                                    && x.IsActive
                                    && x.TenantId == null)
                            .OrderBy(x => x.Id)
                            .FirstOrDefault();

            // No Content Found
            if (content == default)
            {
                var errorMessage = "Could not find content with Id: {contentId}.";
                _logger.LogWarning(errorMessage, contentId.ToString());
            }

            // loop through the list of fields for the content type
            foreach (var field in content.ContentType.Fields.Where(x => x.IsActive))
            {
                // get the current content value record
                ContentValue currentRecord = content.ContentValues.Where(x => x.ContentTypeFieldId == field.Id && x.LocaleId == localeId && x.TenantId == currentTenantId).FirstOrDefault();
                // add check to see if field is available in the input
                if (input.TryGetValue(field.FieldName, out var value) && value != null)
                {
                    string fieldAnswer = input[field.FieldName].ToString();
                    string fileUrl = fieldAnswer.IndexOf("base64") != -1 ? uploadFile(fieldAnswer, field.FieldName) : "";

                    // if no record is found, add item
                    if (currentRecord == null) // Add
                    {
                        content.ContentValues.Add(new ContentValue
                        {
                            Value = (fileUrl != "" ? fileUrl : fieldAnswer),
                            ContentId = contentId,
                            ContentTypeFieldId = field.Id,
                            LocaleId = localeId,
                            TenantId = currentTenantId,
                            InsertedDate = DateTime.UtcNow,
                            UpdatedDate = DateTime.UtcNow
                        });
                    }
                    else // Update
                    {
                        currentRecord.UpdatedDate = DateTime.UtcNow;
                        currentRecord.Value = (fileUrl != "" ? fileUrl : fieldAnswer);
                    }
                }
                else if (field.FieldName.ToString() == "availableLanguages") //update languages of the item if its a language field and the locale doesnt match or is null
                {
                    ContentValue availableLanguages = content.ContentValues.Where(x => x.ContentTypeFieldId == field.Id && x.TenantId == currentTenantId).FirstOrDefault();
                    var allLanguages = content.ContentValues.Select(x => x.LocaleId).Distinct().ToList();

                    if (availableLanguages == null)
                    {
                        content.ContentValues.Add(new ContentValue
                        {
                            Value = string.Join(",", allLanguages),
                            ContentId = contentId,
                            ContentTypeFieldId = field.Id,
                            LocaleId = localeId,
                            TenantId = currentTenantId,
                            InsertedDate = DateTime.UtcNow,
                            UpdatedDate = DateTime.UtcNow
                        });
                    }
                    else
                    {
                        availableLanguages.Value = string.Join(",", allLanguages);
                    }
                }
                content.UpdatedDate = DateTime.UtcNow;
                _context.SaveChanges();
            }

            var objDict = content.ContentValues
                            .Where(x => x.LocaleId == localeId && x.TenantId == currentTenantId)
                            .ToDictionary(k => k.ContentTypeField.FieldName, v => v.Value);
            objDict.Add(ObjectFieldConstants.Identifier, content.Id.ToString());

            // Removing the cached keys for this object to ensure we see the change on the front-end
            // clear cache for all key
            string keyAll = string.Format("Content.{0}.{1}.{2}.All", currentTenantId, content.ContentTypeId, localeId);
            _memoryCache.Remove(keyAll);
            // clear cache for single key
            var keySingle = string.Format("Content.{0}.{1}..Id.{2}", currentTenantId, localeId, contentId);
            _memoryCache.Remove(keySingle);

            return objDict.ToObject();
        }

        public bool Delete(int contentId)
        {
            var content = _context.Contents
                          .Where(x => x.Id == contentId
                            && x.TenantId == TenantExecutionContext.Tenant.Id)
                          .OrderBy(x => x.Id)
                          .FirstOrDefault();

            // Use global tenant as a fallback, mostly for static and dynamic links            
            content ??= _context.Contents
                          .Where(x => x.Id == contentId
                            && x.TenantId == null)
                          .OrderBy(x => x.Id)
                          .FirstOrDefault();

            // No Content Found
            if (content == default)
            {
                var errorMessage = "Could not find content with Id: {contentId}.";
                _logger.LogWarning(errorMessage, contentId.ToString());
            }

            content.IsActive = false;
            content.UpdatedDate = DateTime.UtcNow;

            _context.SaveChanges();

            return true;
        }
    }
}
