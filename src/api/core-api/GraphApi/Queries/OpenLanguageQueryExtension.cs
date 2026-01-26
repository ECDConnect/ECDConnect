
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using HotChocolate;
using HotChocolate.Types;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class OpenLanguageQueryExtension
    {
        [GraphQLType("[Language]!")]
        // Skip permission, because this is called before login
        public IEnumerable<Language> GetOpenLanguage(
            [Service] ILocaleService<Language> localeService)
        {
            var languages = localeService.GetAvailableLocale();
            return languages;
        }
    }
}
