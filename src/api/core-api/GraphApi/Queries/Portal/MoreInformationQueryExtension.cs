using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.Portal
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class MoreInformationQueryExtension
    {
        [GraphQLType("[MoreInformation]!")]
        public IEnumerable<object> GetMoreInformation(
           [Service] ContentManagementRepository contentRepo,
           [Service] ILocaleService<Language> localeService,
           string section,
           string locale)
        {
            Guid languageId;
            if (Guid.TryParse(locale, out languageId))
            {
                languageId = localeService.GetLocaleById(languageId)?.Id ?? Guid.Empty;
            }
            else
            {
                languageId = localeService.GetLocale(locale)?.Id ?? Guid.Empty;
            }
                        
            var natalData = contentRepo.GetByValueKey("NatalInfo", "title", section, languageId);

            if (natalData.Any())
            {
                var allContentValuePairs = new List<object>();
                foreach (var natalInfo in natalData)
                {
                    var more = (IDictionary<string, object>)natalInfo;
                    more.TryGetValue("title", out var visitValue);
                    more.TryGetValue("section", out var sectionValue);
                    more.TryGetValue("type", out var typeValue);
                    more.TryGetValue("pollyTipText", out var infoTitleValue);
                    more.TryGetValue("pollyTipContent", out var infoDescriptionValue);
                    more.TryGetValue("contentSectionA", out var headerAValue);
                    more.TryGetValue("lightBulbSectionA", out var descriptionAValue);
                    more.TryGetValue("contentSectionB", out var headerBValue);
                    more.TryGetValue("lightBulbSectionB", out var descriptionBValue);
                    more.TryGetValue("contentSectionC", out var headerCValue);
                    more.TryGetValue("lightBulbSectionC", out var descriptionCValue);
                    more.TryGetValue("availableLanguages", out var availableLanguages);

                    Dictionary<string, object> dataDict = new Dictionary<string, object>
                {
                    { "title", Convert.ToString(visitValue) },
                    { "section", Convert.ToString(section) },
                    { "type", Convert.ToString(typeValue) },
                    { "infoBoxTitle", Convert.ToString(infoTitleValue)},
                    { "infoBoxDescription", Convert.ToString(infoDescriptionValue)},
                    { "descriptionA", headerAValue},
                    { "descriptionB", headerBValue},
                    { "headerC", Convert.ToString(headerCValue)},
                    { "descriptionC", descriptionCValue},
                    { "availableLanguages", Convert.ToString(availableLanguages) },
                };
                    allContentValuePairs.Add(dataDict);
                }

                return allContentValuePairs;
            }
           
            return contentRepo.GetByValueKey("MoreInformation", "section", section, languageId);
        }
    }
}

