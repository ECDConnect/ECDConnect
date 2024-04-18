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
    public class DangerSignsQueryExtension
    {
        [GraphQLType("[DangerSign]!")]
        public IEnumerable<object> GetDangerSigns(
           [Service] ContentManagementRepository contentRepo,
           [Service] ILocaleService<Language> localeService,
           string section,
           string locale)
        {
            var language = localeService.GetLocale(locale);

            return contentRepo.GetByValueKey("DangerSign", "section", section, language.Id);
        }
    }
}
