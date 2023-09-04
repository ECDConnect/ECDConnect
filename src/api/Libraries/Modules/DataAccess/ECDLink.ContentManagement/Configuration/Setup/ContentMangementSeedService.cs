using ECDLink.ContentManagement.Entities;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Registration;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;

namespace ECDLink.ContentManagement.Configuration.Setup
{
    public class ContentMangementSeedService
    {
        private readonly ContentManagementDbContext _context;
        private readonly JsonFileService _jsonFileService;
        private readonly ILocaleService<Language> _localeService;

        public ContentMangementSeedService(ContentManagementDbContext context, JsonFileService jsonFileService, DynamicContentReload contentReloader, ILocaleService<Language> localeService)
        {
            _context = context;
            _jsonFileService = jsonFileService;
            _localeService = localeService;
        }

        public void SeedContent()
        {
            var address = System.IO.Path.GetDirectoryName(Assembly.GetEntryAssembly().Location);

            var files = Directory.GetFiles($"{address}/Configuration/Setup/", "Content - *");

            foreach (var file in files.OrderBy(x => x))
            {
                SaveSeedContent(file);
            }
        }

        private void SaveSeedContent(string file)
        {
            JObject obj = JObject.Parse(File.ReadAllText(file));

            var workWithMe = obj.ToObject<JsonContentSeed>();

            var contentType = new ContentType
            {
                Name = workWithMe.ContentDefinition.ContentName,
                Description = workWithMe.ContentDefinition.ContentDescription,
                IsActive = true,
                Fields = new List<ContentTypeField>(),
                Content = new List<Content>()
            };

            var fieldDefinitions = _context.FieldTypes.ToList();

            foreach (var field in workWithMe.ContentDefinition.SeedFields)
            {
                var matchingField = fieldDefinitions.Where(x => string.Equals(x.Name, field.Type)).FirstOrDefault();

                if (matchingField != default)
                {
                    contentType.Fields.Add(new ContentTypeField
                    {
                        FieldOrder = field.Order,
                        FieldName = field.Name.FirstCharToLowerCase(),
                        DisplayName = field.Name,
                        FieldTypeId = matchingField.Id,
                        DataLinkName = field?.dataLink ?? string.Empty,
                        IsActive = true
                    });
                }
            }

            // Get the Ids saved in
            _context.ContentTypes.Add(contentType);
            _context.SaveChanges();

            ParseSeedList(contentType, workWithMe.Seed);

            _context.SaveChanges();
        }

        private void ParseSeedList(ContentType contentType, IEnumerable<DataSeed> seedList)
        {
            var contentTypeField = contentType.Fields.ToDictionary(k => k.FieldName, v => v.Id);

            var orderedSeedList = seedList.OrderBy(x => int.Parse(x.Data.Select(y => y["key"]).FirstOrDefault()));

            foreach (var seed in orderedSeedList)
            {
                var objectValues = ParseSeedData(seed.Data, contentTypeField);

                if (!string.IsNullOrWhiteSpace(seed.Id))
                {
                    var newContent = new Content
                    {
                        Id = int.Parse(seed.Id),
                        IsActive = true,
                        ContentTypeId = contentType.Id
                    };

                    _context.Contents.Add(newContent);

                    _context.SaveChanges();

                    newContent.ContentValues = objectValues;
                }
                else
                {
                    contentType.Content.Add(new Content
                    {
                        ContentValues = objectValues,
                        IsActive = true
                    });

                    _context.SaveChanges();
                }
            }
        }

        private List<ContentValue> ParseSeedData(List<Dictionary<string, string>> seedData, Dictionary<string, int> contentTypeField)
        {
            var objectValues = new List<ContentValue>();

            foreach (var dict in seedData)
            {
                if (!dict.TryGetValue("locale", out var locale))
                {
                    continue;
                }

                var localeId = _localeService.GetLocale(locale).Id;

                objectValues.AddRange(GetFieldValues(dict, localeId, contentTypeField));
            }

            return objectValues;
        }

        private List<ContentValue> GetFieldValues(Dictionary<string, string> valueDict, Guid localeId, Dictionary<string, int> contentTypeField)
        {
            var objectValues = new List<ContentValue>();

            foreach (var item in valueDict)
            {
                if (contentTypeField.TryGetValue(item.Key.FirstCharToLowerCase(), out var fieldId))
                {
                    objectValues.Add(new ContentValue
                    {
                        ContentTypeFieldId = fieldId,
                        LocaleId = localeId,
                        Value = item.Value
                    });
                }
            }

            return objectValues;
        }

        public void SeedFields()
        {
            var address = System.IO.Path.GetDirectoryName(Assembly.GetEntryAssembly().Location);

            var data = _jsonFileService.ReadFromFile<IEnumerable<FieldType>>($"{address}/Configuration/Setup/FieldTypeSeed.json");

            _context.FieldTypes.AddRange(data);

            _context.SaveChanges();
        }
    }
}
