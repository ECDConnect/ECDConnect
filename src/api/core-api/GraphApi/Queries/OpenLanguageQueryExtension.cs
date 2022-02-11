using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using HotChocolate;
using HotChocolate.Types;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class OpenLanguageQueryExtension
    {
        [GraphQLType("[Language]!")]
        public IEnumerable<Language> GetOpenLanguage(
            [Service] ILocaleService<Language> localeService)
        {
            var languages = localeService.GetAvailableLocale();
            return languages;
        }
    }
}
