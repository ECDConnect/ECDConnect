using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class HealthPromotionQueryExtension
    {
        [GraphQLType("[HealthPromotion]!")]
        public IEnumerable<object> GetHealthPromotion(
           [Service] ContentManagementRepository contentRepo,
           [Service] ILocaleService<Language> localeService,
           string section,
           string locale)
        {
            var language = localeService.GetLocale(locale);

            var natalData = contentRepo.GetByValueKey("NatalHealth", "title", section, language.Id);

            if (natalData.Any())
            {
                var allContentValuePairs = new List<object>();
                foreach (var natalHealth in natalData)
                {
                    var more = (IDictionary<string, object>)natalHealth;
                    more.TryGetValue("title", out var titleValue);
                    more.TryGetValue("type", out var typeValue);
                    more.TryGetValue("discussionA", out var contentSectionA);
                    more.TryGetValue("id", out var id);
                    more.TryGetValue("availableLanguages", out var availableLanguages);

                    Dictionary<string, object> dataDict = new Dictionary<string, object>
                    {
                        { "id", Convert.ToString(id) },
                        { "visit", Convert.ToString(titleValue) },
                        { "section", Convert.ToString(section) },
                        { "type", Convert.ToString(typeValue) },
                        { "description", Convert.ToString(contentSectionA)},
                        { "availableLanguages", Convert.ToString(availableLanguages) },
                    };
                    allContentValuePairs.Add(dataDict);
                }

                return allContentValuePairs;
            }
        
            return contentRepo.GetByValueKey("HealthPromotion", "section", section, language.Id);
        }
    }
}
