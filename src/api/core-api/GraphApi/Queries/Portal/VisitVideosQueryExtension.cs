using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using HotChocolate;
using HotChocolate.Types;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.Portal
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class VisitVideosQueryExtension
    {
        [GraphQLType("[VisitVideos]!")]
        public IEnumerable<object> GetVisitVideos(
           [Service] ContentManagementRepository contentRepo,
           [Service] ILocaleService<Language> localeService,
           string section,
           string locale)
        {
            var language = localeService.GetLocale(locale);
            return contentRepo.GetByValueKey("VisitVideos", "section", section, language.Id);
        }
    }
}
