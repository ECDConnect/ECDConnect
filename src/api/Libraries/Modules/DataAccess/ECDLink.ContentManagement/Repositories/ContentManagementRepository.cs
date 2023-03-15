using ECDLink.Abstractrions.Enums;
using ECDLink.ContentManagement.Entities;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.EGraphQL.Constants;
using HotChocolate;
using Microsoft.EntityFrameworkCore;
using NPOI.HPSF;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using static DotLiquid.Variable;

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
            var dynamicContentList = new List<object>();

            var contentType = _context.ContentTypes
              .Include(i => i.Content)
              .ThenInclude(ti => ti.ContentValues)
              .ThenInclude(ti => ti.ContentTypeField)
              .Where(x => x.Id == contentTypeId)
              .FirstOrDefault();

            if (contentType != null)
            {
                foreach (var item in contentType.Content.OrderBy(x => x.Id).Where(x => x.IsActive))
                {
                    var objDict = item.ContentValues
                      .Where(x => x.LocaleId == localeId)
                      .Where(x => x.ContentTypeField.IsActive)
                      .ToDictionary(k => k.ContentTypeField.FieldName, v => v.Value);

                    objDict.Add(ObjectFieldConstants.Identifier, item.Id.ToString());

                    dynamicContentList.Add(objDict.ToObject());
                }
            }

            return dynamicContentList;
        }

        public object GetById(int contentId, Guid localeId)
        {
            var content = _context.Contents
                            .Include(i => i.ContentType)
                            .Include(i => i.ContentValues)
                            .ThenInclude(ti => ti.ContentTypeField)
                            .Where(x => x.Id == contentId)
                            .Where(x => x.IsActive)
                            .FirstOrDefault();

            if (content == default)
            {
                return default;
            }

            var objDict = content.ContentValues
                            .Where(x => x.LocaleId == localeId)
                            .ToDictionary(k => k.ContentTypeField.FieldName, v => v.Value);

            objDict.Add(ObjectFieldConstants.Identifier, content.Id.ToString());

            return objDict.ToObject();
        }

        public IEnumerable<object> GetByIds(Guid localeId, params int[] contentIds)
        {
            var content = _context.Contents
                            .Include(i => i.ContentType)
                            .Include(i => i.ContentValues)
                            .ThenInclude(ti => ti.ContentTypeField)
                            .Where(x => contentIds.Contains(x.Id))
                            .Where(x => x.IsActive)
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

        public IEnumerable<object> GetByValueKey(string contentType, string key, string value, Guid localeId)
        {
            var content = _context.Contents
                            .Include(i => i.ContentType)
                            .Include(i => i.ContentValues)
                                .ThenInclude(ti => ti.ContentTypeField)
                            .Where(x => string.Equals(x.ContentType.Name, contentType) && x.IsActive)
                            .Where(x => x.ContentValues.Any(y => string.Equals(y.ContentTypeField.FieldName, key)) &&
                                        x.ContentValues.Any(y => string.Equals(y.Value, value)))
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
                                .Where(x => x.Id == contentTypeId)
                                .FirstOrDefault();

            if (contentType == default) {
                return default;
            }

            var fieldList = contentType.Fields.Where(x => x.IsActive);

            var contentValues = new List<ContentValue>();

            foreach (var field in fieldList)
            {
                if (input.TryGetValue(field.FieldName, out var value))
                {

                    // if we get the string base64 in the value we know it is a file upload 
                    var fileIndex = value?.ToString().IndexOf("base64");

                    if (fileIndex != null && fileIndex != -1) {

                        var fileStr = value?.ToString();
                        var b64Str = fileStr.Substring(fileStr.LastIndexOf(',') + 1);
                        var bytes = Convert.FromBase64String(b64Str);
                        using MemoryStream fileStream = new MemoryStream(bytes);

                        
                        var fileName = field.FieldName + getFileType(fileStr.Substring(0, fileStr.LastIndexOf(',')));
                        var fileUrl = Task.Run(() => _fileService.UploadFileStream(fileStream, fileName, FileTypeEnum.ContentImage)).Result;
                        fileStream.Dispose();

                        contentValues.Add(new ContentValue {
                            Value = fileUrl.ToString(),
                            ContentTypeFieldId = field.Id,
                            LocaleId = localeId
                        });

                    } else {
                        contentValues.Add(new ContentValue
                        {
                            Value = value?.ToString(),
                            ContentTypeFieldId = field.Id,
                            LocaleId = localeId
                        });
                    }

                }
            }

            var newContent = new Content
            {
                ContentTypeId = contentTypeId,
                ContentValues = contentValues,
                IsActive = true
            };

            _context.Contents.Add(newContent);

            _context.SaveChanges();

            return newContent.Id;
        }

        private string getFileType(string fileStr) {
            var fileExt = "";

            if (fileStr.ToLower().IndexOf("svg") != -1) {
                fileExt = ".svg";
            }
            if (fileStr.ToLower().IndexOf("png") != -1) {
                fileExt = ".png";
            }
            if (fileStr.ToLower().IndexOf("jpg") != -1 || fileStr.ToLower().IndexOf("jpeg") != -1) {
                fileExt = ".jpg";
            }
            if (fileStr.ToLower().IndexOf("mov") != -1) {
                fileExt = ".mov";
            }
            if (fileStr.ToLower().IndexOf("mkv") != -1) {
                fileExt = ".mkv";
            }
            if (fileStr.ToLower().IndexOf("mp4") != -1) {
                fileExt = ".mp4";
            }
            if (fileStr.ToLower().IndexOf("mpg") != -1) {
                fileExt = ".mpg";
            }
            if (fileStr.ToLower().IndexOf("webm") != -1) {
                fileExt = ".webm";
            }
            return fileExt;
        }

        public object Update(int contentId, Guid localeId, IDictionary<string, object> input)
        {
            // Can probably inject Id and fields
            var content = _context.Contents
                            .Include(i => i.ContentType)
                            .ThenInclude(ti => ti.Fields)
                            .Include(i => i.ContentValues)
                            .ThenInclude(ti => ti.ContentTypeField)
                            .Where(x => x.Id == contentId)
                            .Where(x => x.IsActive)
                            .FirstOrDefault();

            // No Content Found
            if (content == default)
            {
                return default;
            }

            var fieldList = content.ContentValues.Where(x => x.LocaleId == localeId).ToList();

            _context.ContentTypesFieldValues.RemoveRange(fieldList);

            _context.SaveChanges();

            var contentValues = new List<ContentValue>();

            foreach (var field in content.ContentType.Fields.Where(x => x.IsActive))
            {
                if (input.TryGetValue(field.FieldName, out var value))
                {

                    // if we get the string base64 in the value we know it is a file upload 
                    var fileIndex = value?.ToString().IndexOf("base64");

                    if (fileIndex != null && fileIndex != -1) {

                        var fileStr = value?.ToString();
                        var b64Str = fileStr.Substring(fileStr.LastIndexOf(',') + 1);
                        var bytes = Convert.FromBase64String(b64Str);
                        using MemoryStream fileStream = new MemoryStream(bytes);

                        var fileName = field.FieldName + getFileType(fileStr.Substring(0, fileStr.LastIndexOf(',')));
                        var fileUrl = Task.Run(() => _fileService.UploadFileStream(fileStream, fileName, FileTypeEnum.ContentImage)).Result;
                        fileStream.Dispose();

                        contentValues.Add(new ContentValue {
                            Value = fileUrl.ToString(),
                            ContentTypeFieldId = field.Id,
                            LocaleId = localeId
                        });

                    } else {
                        contentValues.Add(new ContentValue
                        {
                            Value = value?.ToString(),
                            ContentTypeFieldId = field.Id,
                            LocaleId = localeId
                        });
                    }

                }
            }

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
                          .Where(x => x.Id == contentId)
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
