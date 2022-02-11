using ECDLink.ContentManagement.GraphQL.Resolvers.FieldResolvers.Base;
using ECDLink.Core.Models.ContentManagement;
using ECDLink.EGraphQL.Resolvers;
using HotChocolate.Resolvers;

namespace ECDLink.ContentManagement.GraphQL.Resolvers.FieldResolvers
{
    public class FieldResolver : FieldResolverBase, IDynamicFieldResolver
    {
        public object ResolveField(IPureResolverContext ctx, FieldDefinitionModel definition)
        {
            return base.GetFieldValue(ctx, definition.Name);
        }

        //public object ResolveField(IPureResolverContext ctx, FieldDefinitionModel definition)
        //{
        //  var json = JObject.Parse(ctx.Parent<string>());

        //  if (json.TryGetValue(definition.Name, out var tokenValue))
        //  {
        //    return ((JValue)tokenValue).Value;
        //  }

        //  return Type.GetType(definition.AssemblyDataTypeName).GetDefaultValue();
        //}
    }
}
