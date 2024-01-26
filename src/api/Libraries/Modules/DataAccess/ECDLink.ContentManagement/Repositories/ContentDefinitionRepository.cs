using ECDLink.ContentManagement.Entities;
using ECDLink.ContentManagement.Models;
using ECDLink.Core.Models.ContentManagement;
using ECDLink.DataAccessLayer.Context;
using ECDLink.EGraphQL.Builders;
using ECDLink.EGraphQL.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.ContentManagement.Repositories
{
    public class ContentDefinitionRepository
    {
        private readonly ContentManagementDbContext _context;

        public ContentDefinitionRepository(IServiceProvider provider)
        {
            var context = provider.CreateScope().ServiceProvider.GetService<ContentManagementDbContext>();
            _context = context;
        }

        public IEnumerable<ContentDefinitionModel> GetContentDefinitions()
        {
            var contentTypeModel = _context.ContentTypes
                                    .Include(i => i.Fields)
                                    .ThenInclude(ti => ti.FieldType)
                                    .AsNoTracking()
                                    .Where(x => x.IsActive);

            var definition = new List<ContentDefinitionModel>();

            foreach (var item in contentTypeModel)
            {
                var model = ConvertToContentDefinition(item);

                definition.Add(model);
            }

            return definition;
        }

        public ContentDefinitionModel CreateContentDefinition(CreateContentDefinitionModel contentType)
        {
            var contentDefinition = new ContentType
            {
                Description = contentType.Description,
                MetaData = contentType.MetaData,
                Name = contentType.Name,
                IsActive = true,
                Fields = contentType.Fields.Select(x => new ContentTypeField
                {
                    FieldName = x.Name,
                    DataLinkName = x.DataLinkName,
                    FieldTypeId = x.FieldTypeId,
                    IsActive = true
                }).ToList()
            };

            _context.ContentTypes.Add(contentDefinition);

            _context.SaveChanges();

            var fulltype = GetContentTypeById(contentDefinition.Id);

            return ConvertToContentDefinition(fulltype);
        }

        public IEnumerable<ContentDefinitionModel> UpdateContentDefinition(UpdateContentDefinitionModel contentDefinition)
        {
            throw new NotImplementedException();
        }

        public bool DeleteContentDefinition(int id)
        {
            var contentType = GetContentTypeById(id);

            if (contentType == default)
            {
                return false;
            }

            contentType.IsActive = false;

            _context.SaveChanges();

            return true;
        }

        public ContentType GetContentTypeById(int Id)
        {
            return _context.ContentTypes
                              .Include(i => i.Fields)
                              .ThenInclude(ti => ti.FieldType)
                              .Where(x => x.IsActive)
                              .Where(x => x.Id == Id)
                              .OrderBy(x => x.Id)
                              .FirstOrDefault();
        }

        private ContentDefinitionModel ConvertToContentDefinition(ContentType type)
        {
            return new ContentDefinitionModel
            {
                ContentName = type.Name,
                Identifier = type.Id.ToString(),
                Fields = type.Fields.Where(x => x.IsActive).Select(x => new FieldDefinitionModel
                {
                    FieldTypeId = x.FieldTypeId,
                    Name = x.FieldName,
                    DisplayName = x.DisplayName,
                    AssemblyDataTypeName = x.FieldType.AssemblyDataType,
                    DataType = x.FieldType.DataType,
                    GraphDataTypeName = GetFieldType(x),
                    DisplayMainTable = x.DisplayMainTable,
                    DisplayPage = x.DisplayPage,
                    IsRequired = x.IsRequired
                })
            };
        }

        private string GetFieldType(ContentTypeField field)
        {
            if (field.FieldTypeId == (int)FieldTypeEnum.DynamicRelation
                || field.FieldTypeId == (int)FieldTypeEnum.StaticRelation)
            {
                var builder = new DynamicTypeBuilder(field.DataLinkName);
                return builder.Enumerable().Build();
            }

            return field.FieldType.GraphQLDataType;
        }
    }
}
