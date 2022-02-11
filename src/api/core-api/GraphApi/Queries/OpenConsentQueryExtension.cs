using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Builders;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class OpenConsentQueryExtension
    {
        [GraphQLType("[Consent]!")]
        public IEnumerable<object> GetOpenConsent(
            [Service] ContentManagementRepository contentRepo,
            [Service] ILocaleService<Language> localeService,
            string type,
            string locale)
        {
            var language = localeService.GetLocale(locale);

            var content = contentRepo.GetByValueKey("Consent", "type", type, language.Id);

            return content;
        }
    }
}
