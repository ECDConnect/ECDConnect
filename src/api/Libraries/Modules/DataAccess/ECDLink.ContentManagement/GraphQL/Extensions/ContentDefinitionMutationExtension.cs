using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.ContentManagement.Entities;
using ECDLink.ContentManagement.Models;
using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Helpers;
using ECDLink.Core.Models.ContentManagement;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.EGraphQL.Enums;
using ECDLink.EGraphQL.Registration;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using NPOI.SS.UserModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace ECDLink.ContentManagement.GraphQL.Extensions
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ContentDefinitionMutationExtension
    {
        private DynamicContentReload _reloader;

        public ContentDefinitionMutationExtension(DynamicContentReload reloader)
        {
            _reloader = reloader;
        }

        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.Create)]
        public ContentDefinitionModel CreateContentDefinition([Service] ContentDefinitionRepository repository, CreateContentDefinitionModel model)
        {
            var definition = repository.CreateContentDefinition(model);

            _reloader.InvokeUpdate(EventArgs.Empty);

            return definition;
        }

        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.Delete)]
        public bool DeleteContentDefinition([Service] ContentDefinitionRepository repository, int Id)
        {
            return repository.DeleteContentDefinition(Id);
        }

        [Permission(PermissionGroups.GENERAL, GraphActionEnum.Create)]
        public bool ContentTypeImport(
          [Service] ContentDefinitionRepository repository,
          [Service] ContentManagementDbContext context,
          IGenericRepositoryFactory repoFactory,
          int contentTypeId, string file)
        {
            var contentType = repository.GetContentTypeById(contentTypeId);

            var bytes = Convert.FromBase64String(file);
            using MemoryStream fileStream = new MemoryStream(bytes);

            var workbook = WorkbookFactory.Create(fileStream);

            var sheet = workbook.GetSheetAt(0);

            var languageRepo = repoFactory.CreateRepository<Language>();
            var languages = languageRepo.GetAll();

            List<ContentTypeImportItem> contentImportList = new List<ContentTypeImportItem>();
            var headerRow = sheet.GetRow(0);

            for (var row = 1; row <= sheet.LastRowNum; row++)
            {
                var currentRow = sheet.GetRow(row);

                if (currentRow != null)
                {
                    var id = ExcelHelper.GetCellValue(currentRow.GetCell(0));
                    if (id != null)
                    {
                        var locale = ExcelHelper.GetCellValue(currentRow.GetCell(1));
                        var localeEntity = languages.Where(x => x.Locale == locale).OrderBy(x => x.Id).FirstOrDefault();
                        var currentItem = contentImportList.Where(x => x.TempId == id).FirstOrDefault();

                        var item = currentItem != null ? currentItem : new ContentTypeImportItem();

                        var currentTranslation = new ContentTypeImportSubItem();
                        if (currentItem != null)
                        {
                            var foundTranslation = currentItem.Translations.Where(x => x.Locale == locale).FirstOrDefault();

                            if (foundTranslation == null)
                            {
                                currentTranslation.Locale = locale;
                                currentTranslation.ContentValues = new List<ContentValueTemp>();
                            }
                            else
                            {
                                currentTranslation = foundTranslation;
                            }
                        }
                        else
                        {
                            item.Translations = new List<ContentTypeImportSubItem>();
                            item.TempId = id;
                            currentTranslation.Locale = locale;
                            currentTranslation.ContentValues = new List<ContentValueTemp>();
                        }

                        foreach (var contentField in contentType.Fields.OrderBy(x => x.FieldOrder))
                        {
                            if (contentField.FieldType.Id != (int)FieldTypeEnum.DynamicRelation && contentField.FieldType.Id != (int)FieldTypeEnum.StaticRelation)
                            {
                                var headerCell = headerRow.Cells.Where(x => x.StringCellValue == contentField.FieldName).FirstOrDefault();
                                var cell = currentRow.GetCell(headerCell.ColumnIndex);
                                var value = ExcelHelper.GetCellValue(cell);

                                var newValue = new ContentValueTemp
                                {
                                    ContentTypeFieldId = contentField.Id,
                                    LocaleId = localeEntity.Id,
                                    Value = value
                                };

                                currentTranslation.ContentValues.Add(newValue);
                            }
                        }

                        item.Translations.Add(currentTranslation);
                        if (currentItem == null) contentImportList.Add(item);
                    }
                }
            }

            if (contentImportList.Count > 0)
            {
                foreach (var content in contentImportList)
                {
                    var newContent = new Content
                    {
                        IsActive = true,
                        ContentTypeId = contentType.Id
                    };

                    context.Contents.Add(newContent);
                    context.SaveChanges();

                    foreach (var translationCollection in content.Translations)
                    {
                        foreach (var translationValue in translationCollection.ContentValues)
                        {
                            var newContentValue = new ContentValue
                            {
                                ContentId = newContent.Id,
                                ContentTypeFieldId = translationValue.ContentTypeFieldId,
                                LocaleId = translationValue.LocaleId,
                                Value = translationValue.Value
                            };
                            context.ContentValues.Add(newContentValue);
                        }

                    }

                    context.SaveChanges();
                }
            }

            return true;
        }
    }
}
