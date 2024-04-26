using ECDLink.ContentManagement.GraphQL.Resolvers.FieldResolvers.Base;
using ECDLink.Core.Models.ContentManagement;
using ECDLink.EGraphQL.Resolvers;
using HotChocolate.Resolvers;

namespace ECDLink.ContentManagement.GraphQL.Resolvers.FieldResolvers
{
    public class FieldResolver : FieldResolverBase, IDynamicFieldResolver
    {
        public object ResolveField(IPureResolverContext ctx, FieldDefinitionModel definition, int? contentTypeId = null)
        {
            return base.GetFieldValue(ctx, definition.Name);
        }

    }
}
