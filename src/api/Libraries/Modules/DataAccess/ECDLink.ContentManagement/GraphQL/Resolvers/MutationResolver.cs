using ECDLink.ContentManagement.Repositories;
using ECDLink.EGraphQL.Constants;
using ECDLink.EGraphQL.Resolvers;
using HotChocolate.Resolvers;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ECDLink.ContentManagement.GraphQL.Resolvers
{
    public class MutationResolver : ResolverBase, IDynamicMutationResolver
    {
        public ValueTask<object> CreateMutationResolver(IResolverContext context)
        {
            var contentTypeId = base.GetContentIdentifier(context);
            var localeId = base.GetLanguageArgument(context);
            
            var values = context.ArgumentValue<Dictionary<string, object>>(ArgumentConstants.Input);

            var repository = context.Services.GetService<ContentManagementRepository>();

            var newId = repository.Create(contentTypeId, localeId, values);

            return new ValueTask<object>(newId);
        }

        public ValueTask<object> UpdateMutationResolver(IResolverContext context)
        {
            var service = context.Services.GetService<ContentManagementRepository>();

            var locale = base.GetLanguageArgument(context);
            var contentId = context.ArgumentValue<int>(ArgumentConstants.Id);
            var values = context.ArgumentValue<Dictionary<string, object>>(ArgumentConstants.Input);

            var dynamicObject = service.Update(contentId, locale, values);

            return new ValueTask<object>(dynamicObject);
        }

        public ValueTask<object> DeleteMutationResolver(IResolverContext context)
        {
            var contentId = context.ArgumentValue<int>(ArgumentConstants.Id);

            var service = context.Services.GetService<ContentManagementRepository>();

            var isDeleted = service.Delete(contentId);

            return new ValueTask<object>(isDeleted);
        }
    }
}
