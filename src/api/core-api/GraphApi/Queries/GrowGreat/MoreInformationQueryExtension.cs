using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using HotChocolate;
using HotChocolate.Types;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
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
            var language = localeService.GetLocale(locale);
            return contentRepo.GetByValueKey("MoreInformation", "section", section, language.Id);
        }
    }
}
