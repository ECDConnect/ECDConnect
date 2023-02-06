using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Constants;
using HotChocolate.Resolvers;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace ECDLink.ContentManagement.GraphQL.Resolvers
{
    public abstract class ResolverBase
    {
        protected Guid GetLanguageArgument(IResolverContext context)
        {
            var localeIdArgument = context.ArgumentValue<Guid>(ArgumentConstants.LocaleId);

            if (localeIdArgument != default)
            {
                return localeIdArgument;
            }

            var localeService = context.Services.GetService<ILocaleService<Language>>();

            var localeArgument = context.ArgumentValue<string>(ArgumentConstants.Locale);

            var language = localeService.GetLocale(localeArgument);

            if (language == default)
            {
                return default(Guid);
            }

            return language.Id;
        }

        protected int GetContentIdentifier(IResolverContext context)
        {
            

            if (!context.ScopedContextData.TryGetValue(ContextDataConstants.ContentManagement.Identifier, out var contentIdentifier))
            {
                throw new Exception("No table context data found");
            }

            var contentTypeId = Convert.ToInt32(contentIdentifier);

            return contentTypeId;
        }
    }
}
