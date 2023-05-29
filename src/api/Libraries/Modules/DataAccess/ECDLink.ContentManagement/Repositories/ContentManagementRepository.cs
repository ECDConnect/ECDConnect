using ECDLink.Abstractrions.Enums;
using ECDLink.ContentManagement.Entities;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.EGraphQL.Constants;
using ECDLink.Tenancy.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.ContentManagement.Repositories
{
    public class ContentManagementRepository
    {
        private ContentManagementDbContext _context;
        private IFileService _fileService;

        public ContentManagementRepository(ContentManagementDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        public IEnumerable<object> GetAll(int contentTypeId, Guid localeId)
        {
            var allContentValuePairs = new List<object>();
            var currentTenant = TenantExecutionContext.Tenant.Id;

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

            if (contentType?.Content is not null)
            {
                var tenantContents = contentType.Content
                    .Where(x => x.IsActive
                            && x.TenantId == currentTenant)
                    .OrderBy(x => x.Id)
                    .ToList();

                var contents = tenantContents?.Any() ?? false ? tenantContents
                        : contentType.Content.Where(x => x.IsActive
                                    && x.TenantId == null)
                                .OrderBy(x => x.Id)
                                .ToList();

                foreach (var item in contents)
                {
                    // keep our tenant's content values and fill in the gaps with the global tenant's content values
                    // Get the ContentValues for the current tenant
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
            }

            return allContentValuePairs;
        }

        public object GetById(int contentId, Guid localeId)
        {
            // Try get tenant data
            var content = _context.Contents
                            .Include(i => i.ContentType)
                            .Include(i => i.ContentValues)
                                .ThenInclude(ti => ti.ContentTypeField)
                            .Where(x => x.Id == contentId)
                            .Where(x => x.IsActive)
                            .Where(x => x.TenantId == TenantExecutionContext.Tenant.Id)
                            .OrderBy(x => x.Id)
                            .FirstOrDefault();

            if (content == default)
            {
                // Try get global tenant data
                content = _context.Contents
                            .Include(i => i.ContentType)
                            .Include(i => i.ContentValues)
                                .ThenInclude(ti => ti.ContentTypeField)
                            .Where(x => x.Id == contentId)
                            .Where(x => x.IsActive)
                            .Where(x => x.TenantId == null)
                            .OrderBy(x => x.Id)
                            .FirstOrDefault();
            }
            
            if (content == default)
            {
                return default;
            }

            var contentValues = content.ContentValues
                            .Where(x => x.LocaleId == localeId
                                && x.TenantId == TenantExecutionContext.Tenant.Id)
                            .OrderBy(x => x.ContentTypeField?.FieldOrder)
                            .ToDictionary(k => k.ContentTypeField.FieldName, v => v.Value);
            
            contentValues = !contentValues?.Any() ?? false 
                ? content.ContentValues
                    .Where(x => x.LocaleId == localeId
                        && x.TenantId == TenantExecutionContext.Tenant.Id)
                    .OrderBy(x => x.ContentTypeField?.FieldOrder)
                    .ToDictionary(k => k.ContentTypeField.FieldName, v => v.Value) 
                : new Dictionary<string, string>();

            contentValues.Add(ObjectFieldConstants.Identifier, content.Id.ToString());

            return contentValues.ToObject();
        }

        public IEnumerable<object> GetByIds(Guid localeId, params int[] contentIds)
        {
            var content = _context.Contents
                            .Include(i => i.ContentType)
                            .Include(i => i.ContentValues)
                            .ThenInclude(ti => ti.ContentTypeField)
                            .Where(x => contentIds.Contains(x.Id)
                                && x.IsActive
                                && x.TenantId == TenantExecutionContext.Tenant.Id)
                            .OrderBy(c => c.Id);
            
            // TODO: Add diff support for global tenant
            content = content?.Any() ?? false ? content 
                : _context.Contents
                    .Include(i => i.ContentType)
                    .Include(i => i.ContentValues)
                    .ThenInclude(ti => ti.ContentTypeField)
                    .Where(x => contentIds.Contains(x.Id)
                        && x.IsActive
                        && x.TenantId == null)
                    .OrderBy(c => c.Id);

            if (content == default)
            {
                return default;
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

        public IEnumerable<object> GetByValueKey(string contentType, string key, string value, Guid localeId)
        {
            var contentTypeOrig = _context.ContentTypes
              .Include(i => i.Content)
              .ThenInclude(ti => ti.ContentValues)
              .ThenInclude(ti => ti.ContentTypeField)
              .Where(x => x.Name == contentType
                  && x.IsActive == true
                  && x.TenantId == TenantExecutionContext.Tenant.Id)
              .OrderBy(x => x.Id)
              .FirstOrDefault();
            
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

            if (content == default)
            {
                return default;
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
                                    && (x.TenantId == TenantExecutionContext.Tenant.Id || x.TenantId == null))
                                .OrderByDescending(x => x.TenantId)
                                .ThenBy(x => x.Id)
                                .FirstOrDefault();

            if (contentType == default)
            {
                return default;
            }

            var fieldList = contentType.Fields.Where(x => x.IsActive);

            var contentValues = new List<ContentValue>();

            foreach (var field in fieldList)
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

            if (fileStr.ToLower().IndexOf("svg") != -1)
            {
                fileExt = ".svg";
            }
            if (fileStr.ToLower().IndexOf("png") != -1)
            {
                fileExt = ".png";
            }
            if (fileStr.ToLower().IndexOf("jpg") != -1 || fileStr.ToLower().IndexOf("jpeg") != -1)
            {
                fileExt = ".jpg";
            }
            if (fileStr.ToLower().IndexOf("mov") != -1)
            {
                fileExt = ".mov";
            }
            if (fileStr.ToLower().IndexOf("mkv") != -1)
            {
                fileExt = ".mkv";
            }
            if (fileStr.ToLower().IndexOf("mp4") != -1)
            {
                fileExt = ".mp4";
            }
            if (fileStr.ToLower().IndexOf("mpg") != -1)
            {
                fileExt = ".mpg";
            }
            if (fileStr.ToLower().IndexOf("webm") != -1)
            {
                fileExt = ".webm";
            }
            return fileExt;
        }

        public object Update(int contentId, Guid localeId, IDictionary<string, object> input)
        {
            var currentTenantId = TenantExecutionContext.Tenant.Id;

            // TODO: Can probably inject Id and fields?
            // Find all content for contentId, for current tenant
            var tenantContent = _context.Contents
                            .Include(i => i.ContentType)
                                .ThenInclude(ti => ti.Fields)
                            .Include(i => i.ContentValues)
                                .ThenInclude(ti => ti.ContentTypeField)
                            .Where(c => c.IsActive
                                && c.Id == contentId
                                && c.TenantId == currentTenantId)
                            .OrderByDescending(c => c.InsertedDate)
                            .ThenByDescending(c => c.UpdatedDate)
                            .FirstOrDefault(c => c.TenantId == currentTenantId);

            Content globalContent = default;

            // No tenant Content
            if (tenantContent == default)
            {
                // try get globalContent
                globalContent = _context.Contents
                            .Include(i => i.ContentType)
                                .ThenInclude(ti => ti.Fields)
                            .Include(i => i.ContentValues)
                                .ThenInclude(ti => ti.ContentTypeField)
                            .Where(c => c.IsActive
                                && c.Id == contentId
                                && c.TenantId == null)
                            .OrderByDescending(c => c.InsertedDate)
                            .OrderByDescending(c => c.UpdatedDate)
                            .AsNoTracking() // Fetch the content without tracking changes
                            .FirstOrDefault(c => c.TenantId == null);

                if (globalContent == default)
                    throw new InvalidOperationException($"Content cannot be found. Id:{contentId}, TenantId:{Guid.Empty} | null, currentTenant:{currentTenantId}");
            }

            // No Content for current tenant, save globalContent with new "input" as new tenant content (uses globalContent types as Template)
            if (tenantContent == default)
            {
                // Make null tenantId not null.
                // globalContent was loaded as "AsNoTracking" so can be modified and saved as new tenantContent
                globalContent.TenantId = currentTenantId;

                // Make null tenantId not null.
                foreach (var value in globalContent.ContentValues)
                {
                    value.TenantId = currentTenantId;
                }

                // Make null tenantId not null.
                globalContent.ContentType.TenantId = currentTenantId;

                // Make null tenantId not null.
                foreach (var field in globalContent.ContentType.Fields)
                {
                    field.TenantId = currentTenantId;
                }

                // Remove the content values for the input locale and current tenant, this is part of the update
                var valuesForLocale = globalContent.ContentValues.Where(cv => cv.LocaleId == localeId).ToList();
                _context.ContentValues.RemoveRange(valuesForLocale);

                // add new "input" to the template created from existing tenantContent types
                var contentValues = new List<ContentValue>();

                foreach (var field in globalContent.ContentType.Fields.Where(x => x.IsActive))
                {
                    var fieldType = field.FieldType;

                    if (input.TryGetValue(field.FieldName, out var inputValue))
                    {
                        ContentValue inputContent = default;

                        // TODO: What if we don't get a string? Why are accepting objects!
                        var inputValueString = inputValue?.ToString();

                        // if we get the string base64 in the value we know it is a file upload 
                        // TODO: Security, also what if "base64" is missing?
                        var fileIndex = inputValueString?.IndexOf("base64");
                        if (fileIndex > -1)
                        {
                            var fileStr = inputValueString;
                            var b64Str = fileStr.Substring(fileStr.LastIndexOf(',') + 1);
                            var bytes = Convert.FromBase64String(b64Str);
                            using MemoryStream fileStream = new MemoryStream(bytes);

                            var fileName = DateTime.Now.Ticks + "_" + field.FieldName + getFileType(fileStr.Substring(0, fileStr.LastIndexOf(',')));
                            // TODO: What if upload fails?
                            // TODO: Use _fileService.UploadBase64StringFile? Will "validate" file type, also fileStream closure?
                            var fileUrl = Task.Run(() => _fileService.UploadFileStream(fileStream, fileName, FileTypeEnum.ContentImage)).Result;
                            fileStream.Dispose();

                            inputContent = new ContentValue
                            {
                                Value = fileUrl.ToString(),
                                ContentTypeFieldId = field.Id,
                                LocaleId = localeId,
                                TenantId = currentTenantId // We no longer modify global content?
                            };
                        }
                        else
                        {
                            inputContent = new ContentValue
                            {
                                Value = inputValueString,
                                ContentTypeFieldId = field.Id,
                                LocaleId = localeId,
                                TenantId = currentTenantId // We no longer modify global content?
                            };
                        }

                        if (inputContent != default)
                            contentValues.Add(inputContent);
                    }
                }

                contentValues.AddRange(globalContent.ContentValues);

                globalContent.ContentValues = contentValues;

                _context.Contents.Add(globalContent);
                _context.SaveChanges();

                // Create response object
                // TODO: We are returning a dictionary as an anonymous object as object types can change?
                var objDict = globalContent.ContentValues
                                .Where(cv => cv.LocaleId == localeId)
                                .ToDictionary(k => k.ContentTypeField.FieldName, v => v.Value);

                objDict.Add(ObjectFieldConstants.Identifier, globalContent.Id.ToString());

                return objDict.ToObject();
            }
            else
            // Content Found for current tenant, save new "input" using tenantContent types as Template)
            {
                // Remove the content values for the input locale and current tenant
                // The insert will fail if the existing content values are not removed
                var valuesForLocale = tenantContent.ContentValues?.Where(cv => cv.LocaleId == localeId).ToList();
                _context.ContentValues.RemoveRange(valuesForLocale);

                //TODO: Do we have to save here?
                _context.SaveChanges();

                // add new "input" to the template created from existing tenantContent types
                var contentValues = new List<ContentValue>();

                foreach (var field in tenantContent.ContentType?.Fields?.Where(x => x.IsActive))
                {
                    var fieldType = field.FieldType;

                    if (input.TryGetValue(field.FieldName, out var inputValue))
                    {
                        ContentValue newContent = null;

                        // TODO: What if we don't get a string? Why are accepting objects!
                        var inputValueString = inputValue?.ToString();

                        // if we get the string base64 in the value we know it is a file upload 
                        // TODO: Security, also what if "base64" is missing?
                        var fileIndex = inputValueString?.IndexOf("base64");
                        if (fileIndex > -1)
                        {
                            var fileStr = inputValueString;
                            var b64Str = fileStr.Substring(fileStr.LastIndexOf(',') + 1);
                            var bytes = Convert.FromBase64String(b64Str);
                            using MemoryStream fileStream = new MemoryStream(bytes);

                            var fileName = DateTime.Now.Ticks + "_" + field.FieldName + getFileType(fileStr.Substring(0, fileStr.LastIndexOf(',')));
                            // TODO: What if upload fails?
                            // TODO: Use _fileService.UploadBase64StringFile? Will "validate" file type, also fileStream closure?
                            var fileUrl = Task.Run(() => _fileService.UploadFileStream(fileStream, fileName, FileTypeEnum.ContentImage)).Result;
                            fileStream.Dispose();

                            newContent = new ContentValue
                            {
                                Value = fileUrl.ToString(),
                                ContentTypeFieldId = field.Id,
                                LocaleId = localeId,
                                TenantId = currentTenantId // We no longer modify global content
                            };
                        }
                        else
                        {
                            newContent = new ContentValue
                            {
                                Value = inputValueString,
                                ContentTypeFieldId = field.Id,
                                LocaleId = localeId,
                                TenantId = currentTenantId // We no longer modify global content
                            };
                        }

                        contentValues.Add(newContent);
                    }
                }

                contentValues.AddRange(tenantContent.ContentValues);

                tenantContent.ContentValues = contentValues;

                _context.SaveChanges();

                // Create response object
                // TODO: We are returning a dictionary as an anonymous object as object types can change?
                var objDict = tenantContent.ContentValues
                                .Where(cv => cv.LocaleId == localeId)
                                .ToDictionary(k => k.ContentTypeField.FieldName, v => v.Value);

                objDict.Add(ObjectFieldConstants.Identifier, tenantContent.Id.ToString());

                return objDict.ToObject();
            }

            // TODO: globalContent is not modified... is this correct?

        }

        public bool Delete(int contentId)
        {
            var content = _context.Contents
                          .Where(x => x.Id == contentId)
                          .OrderBy(x => x.Id)
                          .FirstOrDefault();

            if (content == default)
            {
                return false;
            }

            content.IsActive = false;

            _context.SaveChanges();

            return true;
        }
    }
}
