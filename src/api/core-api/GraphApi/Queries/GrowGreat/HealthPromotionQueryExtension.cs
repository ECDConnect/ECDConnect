using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using HotChocolate;
using HotChocolate.Types;
using System.Collections.Generic;

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

            return contentRepo.GetByValueKey("HealthPromotion", "section", section, language.Id);
        }
    }
}
