using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using HotChocolate;
using HotChocolate.Types;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class OpenConsentQueryExtension
    {
        [GraphQLType("[Consent]!")]
        //Skip this permission - GENERIC permission is on the cms tables.
        public IEnumerable<object> GetOpenConsent(
            [Service] ContentManagementRepository contentRepo,
            [Service] ILocaleService<Language> localeService,
            string name,
            string locale)
        {
            var language = localeService.GetLocale(locale);
            if (language == null) return Enumerable.Empty<object>();

            var content = contentRepo.GetByValueKey("Consent", "name", name, language.Id);

            return content;
        }
    }
}
