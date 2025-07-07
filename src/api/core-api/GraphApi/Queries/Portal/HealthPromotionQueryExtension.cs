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
    public class HealthPromotionQueryExtension
    {
        [GraphQLType("[HealthPromotion]!")]
        public IEnumerable<object> GetHealthPromotion(
           [Service] ContentManagementRepository contentRepo,
           [Service] ILocaleService<Language> localeService,
           string section,
           string locale,
           string title)
        {
            var language = localeService.GetLocale(locale);
            var natalData = new List<object>();  

            if (String.IsNullOrEmpty(title))
            {
                natalData = (List<object>)contentRepo.GetByValueKey("NatalHealth", "title", section, language.Id);
            } else
            {
                natalData = (List<object>)contentRepo.GetContentByTitleAndSection("NatalHealth", section, language.Id, title);

            }

            if (natalData.Any())
            {
                var allContentValuePairs = new List<object>();
                foreach (var natalHealth in natalData)
                {
                    var more = (IDictionary<string, object>)natalHealth;
                    more.TryGetValue("title", out var titleValue);
                    more.TryGetValue("type", out var typeValue);
                    more.TryGetValue("discussionA", out var contentSectionA);
                    more.TryGetValue("discussionB", out var contentSectionB);
                    more.TryGetValue("discussionC", out var contentSectionC);
                    more.TryGetValue("discussionD", out var contentSectionD);
                    more.TryGetValue("discussionE", out var contentSectionE);
                    more.TryGetValue("discussionF", out var contentSectionF);
                    more.TryGetValue("discussionG", out var contentSectionG);
                    more.TryGetValue("discussionH", out var contentSectionH);
                    more.TryGetValue("discussionI", out var contentSectionI);
                    more.TryGetValue("discussionJ", out var contentSectionJ);
                    more.TryGetValue("id", out var id);
                    more.TryGetValue("availableLanguages", out var availableLanguages);

                    Dictionary<string, object> dataDict = new Dictionary<string, object>
                    {
                        { "id", Convert.ToString(id) },
                        { "visit", Convert.ToString(titleValue) },
                        { "section", Convert.ToString(section) },
                        { "type", Convert.ToString(typeValue) },
                        { "description", Convert.ToString(contentSectionA)},
                        { "descriptionB", Convert.ToString(contentSectionB)},
                        { "descriptionC", Convert.ToString(contentSectionC)},
                        { "descriptionD", Convert.ToString(contentSectionD)},
                        { "descriptionE", Convert.ToString(contentSectionE)},
                        { "descriptionF", Convert.ToString(contentSectionF)},
                        { "descriptionG", Convert.ToString(contentSectionG)},
                        { "descriptionH", Convert.ToString(contentSectionH)},
                        { "descriptionI", Convert.ToString(contentSectionI)},
                        { "descriptionJ", Convert.ToString(contentSectionJ)},
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
