using ECDLink.ContentManagement.Repositories;
using ECDLink.EGraphQL.Constants;
using ECDLink.EGraphQL.Resolvers;
using HotChocolate.Resolvers;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;

namespace ECDLink.ContentManagement.GraphQL.Resolvers
{
    public class QueryResolvers : ResolverBase, IDynamicQueryResolver
    {
        public ValueTask<object> GetAllResolver(IResolverContext context)
        {
            var repository = context.Services.GetService<ContentManagementRepository>();

            var contentTypeId = base.GetContentIdentifier(context);

            var localeId = base.GetLanguageArgument(context);

            var dynamicContentList = repository.GetAll(contentTypeId, localeId);

            return new ValueTask<object>(dynamicContentList);
        }

        public ValueTask<object> GetResolver(IResolverContext context)
        {
            var repository = context.Services.GetService<ContentManagementRepository>();

            var contentId = context.ArgumentValue<int>(ArgumentConstants.Id);
            var locale = base.GetLanguageArgument(context);

            var dynamicObject = repository.GetById(contentId, locale);

            return new ValueTask<object>(dynamicObject);
        }
    }
}
