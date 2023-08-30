using ECDLink.Abstractrions.Enums;
using ECDLink.ContentManagement.Entities;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.EGraphQL.Constants;
using ECDLink.Tenancy.Context;
using Microsoft.EntityFrameworkCore;
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
        private readonly IFileService _fileService;
        private readonly ILogger<ContentManagementRepository> _logger;

        public ContentManagementRepository(ContentManagementDbContext context, IFileService fileService, ILogger<ContentManagementRepository> logger)
        {
            _context = context;
            _fileService = fileService;
            _logger = logger;
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

            // Get the complete content for null tenant and current tenants.
            var contentType = _context.ContentTypes
                  .Include(ct => ct.Content)
                      .ThenInclude(c => c.ContentValues)
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
                    .Where(x => x.IsActive
                            && x.TenantId == currentTenant)
                    .OrderBy(x => x.Id)
                    .ToList();

            // Use global tenant as a fallback, mostly for static and dynamic links
            contents = contents?.Any() ?? false ? contents
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

            foreach (var item in contents)
            {
                // keep our tenant's content values and fill in the gaps with the global tenant's content values
                // Get the ContentValues for the current tenant, or the global tenant.
                var contentValues = item.ContentValues
                    .Where(x => x.LocaleId == localeId
                            && x.ContentTypeField.IsActive == true
                            && (x.TenantId == TenantExecutionContext.Tenant.Id || x.TenantId == null))
                    .OrderBy(cv => cv?.ContentTypeField?.FieldOrder ?? cv?.ContentId)
                    .ToList();

                // Ignore the TenantId on ContentTypeField because HotChocolate doesn't allow duplicate names.
                var contentFieldValuePairs = contentValues.ToDictionary(k => k.ContentTypeField.FieldName, v => v.Value);
                contentFieldValuePairs.Add(ObjectFieldConstants.Identifier, item.Id.ToString());
                if (contentFieldValuePairs?.Any() ?? false)
                {
                    allContentValuePairs.Add(contentFieldValuePairs.ToObject());
                }
            }

            return allContentValuePairs;
        }

        public object GetById(int contentId, Guid localeId)
        {
            var currentTenant = TenantExecutionContext.Tenant.Id;
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

            var contentValues = content.ContentValues
                            .Where(x => x.LocaleId == localeId
                                && x.TenantId == currentTenant)
                            .OrderBy(x => x.ContentTypeField?.FieldOrder)
                            .ToDictionary(k => k.ContentTypeField.FieldName, v => v.Value);

            contentValues.Add(ObjectFieldConstants.Identifier, content.Id.ToString());

            return contentValues.ToObject();
        }

        public IEnumerable<object> GetByIds(Guid localeId, params int[] contentIds)
        {
            // TODO: Do we need to selectively skip the IsActive check?
            var content = _context.Contents
                            .Include(i => i.ContentType)
                            .Include(i => i.ContentValues)
                            .ThenInclude(ti => ti.ContentTypeField)
                            .Where(x => contentIds.Contains(x.Id)
                                && x.IsActive
                                && x.TenantId == TenantExecutionContext.Tenant.Id)
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
                // TODO: Use .Query() to get the data in one query?
                var objDict = item.ContentValues
                              .Where(x => x.LocaleId == localeId)
                              .ToDictionary(k => k.ContentTypeField.FieldName, v => v.Value);

                objDict.Add(ObjectFieldConstants.Identifier, item.Id.ToString());
                dynamicContentList.Add(objDict.ToObject());
            }

            return dynamicContentList;
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
                                && x.ContentValues.Any(y => y.LocaleId == localeId)
                                && x.ContentValues.Any(y => y.ContentTypeField.FieldName == key)
                                && x.ContentValues.Any(y => y.Value == value))
                        .ToList();

            // No Content Found
            if (content == default || !content.Any())
            {
                var errorMessage = "Could not find 'ContentType' with Name, key or value: {contentType}, {key}, {value}.";
                _logger.LogWarning(errorMessage, contentType.ToString(), key, value);
            }

            var dynamicContentList = new List<object>();

            foreach (var item in content)
            {
                var objDict = item.ContentValues
                              .Where(x => x.LocaleId == localeId)
                              .ToDictionary(k => k.ContentTypeField.FieldName, v => v.Value);

                objDict.Add(ObjectFieldConstants.Identifier, item.Id.ToString());

                dynamicContentList.Add(objDict.ToObject());
            }

            return dynamicContentList;
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

                        var fileStr = value?.ToString();
                        var b64Str = fileStr.Substring(fileStr.LastIndexOf(',') + 1);
                        var bytes = Convert.FromBase64String(b64Str);
                        using MemoryStream fileStream = new MemoryStream(bytes);

                        var fileName = DateTime.Now.Ticks + "_" + field.FieldName + getFileType(fileStr.Substring(0, fileStr.LastIndexOf(',')));
                        var fileUrl = Task.Run(() => _fileService.UploadFileStream(fileStream, fileName, FileTypeEnum.ContentImage)).Result;
                        fileStream.Dispose();

                        contentValues.Add(new ContentValue
                        {
                            Value = fileUrl.ToString(),
                            ContentTypeFieldId = field.Id,
                            LocaleId = localeId,
                            TenantId = TenantExecutionContext.Tenant.Id
                        });

                    }
                    else
                    {
                        contentValues.Add(new ContentValue
                        {
                            Value = value?.ToString(),
                            ContentTypeFieldId = field.Id,
                            LocaleId = localeId,
                            TenantId = TenantExecutionContext.Tenant.Id
                        });
                    }

                }
            }

            var newContent = new Content
            {
                ContentTypeId = contentTypeId,
                ContentValues = contentValues,
                IsActive = true,
                TenantId = TenantExecutionContext.Tenant.Id
            };

            _context.Contents.Add(newContent);

            _context.SaveChanges();

            return newContent.Id;
        }

        private string getFileType(string fileStr)
        {
            var fileExt = "";

            if (fileStr.ToLower().EndsWith("svg"))
            {
                fileExt = ".svg";
            }
            if (fileStr.ToLower().EndsWith("png"))
            {
                fileExt = ".png";
            }
            if (fileStr.ToLower().EndsWith("jpg") || fileStr.ToLower().EndsWith("jpeg"))
            {
                fileExt = ".jpg";
            }
            if (fileStr.ToLower().EndsWith("mov"))
            {
                fileExt = ".mov";
            }
            if (fileStr.ToLower().EndsWith("mkv"))
            {
                fileExt = ".mkv";
            }
            if (fileStr.ToLower().EndsWith("mp4"))
            {
                fileExt = ".mp4";
            }
            if (fileStr.ToLower().EndsWith("mpg"))
            {
                fileExt = ".mpg";
            }
            if (fileStr.ToLower().EndsWith("webm"))
            {
                fileExt = ".webm";
            }
            return fileExt;
        }

        public object Update(int contentId, Guid localeId, IDictionary<string, object> input)
        {
            // Can probably inject Id and fields
            Guid? currentTenant = TenantExecutionContext.Tenant.Id;

            var content = _context.Contents
                            .Include(i => i.ContentType)
                                .ThenInclude(ti => ti.Fields)
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

            // Remove existing data for this locale
            var fieldList = content.ContentValues.Where(x => x.LocaleId == localeId).ToList();
            _context.ContentValues.RemoveRange(fieldList);
            _context.SaveChanges();

            var contentValues = new List<ContentValue>();

            // Get the content type fields and populate them to be the new values
            foreach (var field in content.ContentType.Fields.Where(x => x.IsActive))
            {
                if (input.TryGetValue(field.FieldName, out var value))
                {

                    // if we get the string base64 in the value we know it is a file upload 
                    var fileIndex = value?.ToString()?.IndexOf("base64");

                    if (fileIndex != null && fileIndex != -1)
                    {

                        var fileStr = value?.ToString();
                        var b64Str = fileStr.Substring(fileStr.LastIndexOf(',') + 1);
                        var bytes = Convert.FromBase64String(b64Str);
                        using MemoryStream fileStream = new MemoryStream(bytes);

                        var fileName = DateTime.Now.Ticks + "_" + field.FieldName + getFileType(fileStr.Substring(0, fileStr.LastIndexOf(',')));
                        var fileUrl = Task.Run(() => _fileService.UploadFileStream(fileStream, fileName, FileTypeEnum.ContentImage)).Result;
                        fileStream.Dispose();

                        contentValues.Add(new ContentValue
                        {
                            Value = fileUrl.ToString(),
                            ContentTypeFieldId = field.Id,
                            LocaleId = localeId,
                            TenantId = currentTenant
                        });

                    }
                    else
                    {
                        contentValues.Add(new ContentValue
                        {
                            Value = value?.ToString(),
                            ContentTypeFieldId = field.Id,
                            LocaleId = localeId,
                            TenantId = currentTenant
                        });
                    }

                }
            }

            // Add existing content to the new content and replace the existing content.
            contentValues.AddRange(content.ContentValues);
            content.ContentValues = contentValues;

            _context.SaveChanges();

            var objDict = content.ContentValues
                            .Where(x => x.LocaleId == localeId)
                            .ToDictionary(k => k.ContentTypeField.FieldName, v => v.Value);
            objDict.Add(ObjectFieldConstants.Identifier, content.Id.ToString());

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
                            && x.TenantId == TenantExecutionContext.Tenant.Id)
                          .OrderBy(x => x.Id)
                          .FirstOrDefault();

            // No Content Found
            if (content == default)
            {
                var errorMessage = "Could not find content with Id: {contentId}.";
                _logger.LogWarning(errorMessage, contentId.ToString());
            }

            content.IsActive = false;

            _context.SaveChanges();

            return true;
        }
    }
}
