using ECDLink.ContentManagement.Entities;
using ECDLink.Core.Extensions;
using ECDLink.DataAccessLayer.Context;
using ECDLink.EGraphQL.Constants;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.ContentManagement.Repositories
{
    public class ContentManagementRepository
    {
        private ContentManagementDbContext _context;

        public ContentManagementRepository(ContentManagementDbContext context)
        {
            _context = context;
        }

        public IEnumerable<object> GetAll(int contentTypeId, Guid localeId)
        {
            // Can probably inject Id and fields
            var contentType = _context.ContentTypes
              .Include(i => i.Content)
              .ThenInclude(ti => ti.ContentValues)
              .ThenInclude(ti => ti.ContentTypeField)
              .Where(x => x.Id == contentTypeId)
              .FirstOrDefault();

            if(contentType == null)
            {
                return new List<object>();
            }

            var dynamicContentList = new List<object>();

            foreach (var item in contentType.Content.OrderBy(x => x.Id).Where(x => x.IsActive))
            {
                var objDict = item.ContentValues
                  .Where(x => x.LocaleId == localeId)
                  .Where(x => x.ContentTypeField.IsActive)
                  .ToDictionary(k => k.ContentTypeField.FieldName, v => v.Value);

                objDict.Add(ObjectFieldConstants.Identifier, item.Id.ToString());

                dynamicContentList.Add(objDict.ToObject());
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
                    contentValues.Add(new ContentValue
                    {
                        Value = value?.ToString(),
                        ContentTypeFieldId = field.Id,
                        LocaleId = localeId
                    });
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
                    contentValues.Add(new ContentValue
                    {
                        Value = value?.ToString(),
                        ContentTypeFieldId = field.Id,
                        LocaleId = localeId
                    });
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
