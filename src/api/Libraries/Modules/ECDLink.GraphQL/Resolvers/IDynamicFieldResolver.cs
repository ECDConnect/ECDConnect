using ECDLink.Core.Models.ContentManagement;
using HotChocolate.Resolvers;

namespace ECDLink.EGraphQL.Resolvers
{
    public interface IDynamicFieldResolver
    {
        object ResolveField(IPureResolverContext ctx, FieldDefinitionModel definition, int? contentTypeId = null);
    }
}
