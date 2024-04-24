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
    public class InfographicsQueryExtension
    {
        [GraphQLType("[Infographics]!")]
        public IEnumerable<object> GetInfographics(
           [Service] ContentManagementRepository contentRepo,
           [Service] ILocaleService<Language> localeService,
           string section,
           string locale)
        {
            var language = localeService.GetLocale(locale);

            var natalData = contentRepo.GetByValueKey("NatalGraphic", "title", section, language.Id);
            if (natalData.Any())
            {
                var allContentValuePairs = new List<object>();
                foreach (var natalGraphic in natalData)
                {
                    var more = (IDictionary<string, object>)natalGraphic;
                    more.TryGetValue("title", out var titleValue);
                    more.TryGetValue("type", out var typeValue);
                    more.TryGetValue("image", out var image);
                    more.TryGetValue("id", out var id);
                    more.TryGetValue("availableLanguages", out var availableLanguages);

                    Dictionary<string, object> dataDict = new Dictionary<string, object>
                    {
                        { "id", Convert.ToString(id) },
                        { "visit", Convert.ToString(titleValue) },
                        { "section", Convert.ToString(section) },
                        { "type", Convert.ToString(typeValue) },
                        { "imageA", Convert.ToString(image)},
                        { "availableLanguages", Convert.ToString(availableLanguages) },
                    };
                    allContentValuePairs.Add(dataDict);
                }

                return allContentValuePairs;
            }
            return contentRepo.GetByValueKey("Infographics", "section", section, language.Id);
        }
    }
}
