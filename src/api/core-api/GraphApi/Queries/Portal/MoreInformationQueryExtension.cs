using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.Portal
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
            Guid languageId;
            if (Guid.TryParse(locale, out languageId))
            {
                languageId = localeService.GetLocaleById(languageId)?.Id ?? Guid.Empty;
            }
            else
            {
                languageId = localeService.GetLocale(locale)?.Id ?? Guid.Empty;
            }

            return contentRepo.GetByValueKey("MoreInformation", "type", section, languageId);
        }
    }
}
