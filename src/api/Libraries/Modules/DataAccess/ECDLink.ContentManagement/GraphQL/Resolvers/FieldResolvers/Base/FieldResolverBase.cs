using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Constants;
using ECDLink.EGraphQL.Helpers;
using HotChocolate.Resolvers;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.ContentManagement.GraphQL.Resolvers.FieldResolvers.Base
{
    public abstract class FieldResolverBase
    {
        protected object GetFieldValue(IPureResolverContext ctx, string fieldName)
        {
            var model = ctx.Parent<IDictionary<string, object>>();

            if (model.TryGetValue(fieldName.FirstCharToLowerCase(), out var fieldValue))
            {
                return fieldValue;
            }

            return null;
        }

        protected int[] ValueToList(object fieldValue)
        {
            try
            {
                var stringValueList = fieldValue.ToString().Split(",");

                var intIdList = stringValueList.Where(x => !string.IsNullOrWhiteSpace(x))
                                .Select(x => int.Parse(x)).ToArray();

                return intIdList;
            }
            catch
            {
                return Array.Empty<int>();
            }
        }

        protected Guid[] ValueToGuidList(object fieldValue)
        {
            try
            {
                var stringValueList = fieldValue.ToString().Split(",");

                var intIdList = stringValueList.Where(x => !string.IsNullOrWhiteSpace(x))
                                .Select(x => Guid.Parse(x)).ToArray();

                return intIdList;
            }
            catch
            {
                return Array.Empty<Guid>();
            }
        }

        protected Guid GetContextLocale(IPureResolverContext ctx)
        {
            var localeId = ArgumentHelper.GetArgument(ctx, ArgumentConstants.LocaleId);

            if (localeId != default)
            {
                return Guid.Parse(localeId.ToString());
            }

            var locale = ArgumentHelper.GetArgument(ctx, ArgumentConstants.Locale);

            if (locale == default)
            {
                return default(Guid);
            }

            var stringLocale = locale.ToString();

            var localeService = ctx.Service<ILocaleService<Language>>();

            return localeService?.GetLocale(stringLocale)?.Id ?? default(Guid);
        }
    }
}
