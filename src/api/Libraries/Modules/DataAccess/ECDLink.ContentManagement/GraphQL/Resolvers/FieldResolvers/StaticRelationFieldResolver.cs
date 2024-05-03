using ECDLink.ContentManagement.GraphQL.Resolvers.FieldResolvers.Base;
using ECDLink.Core.Models.ContentManagement;
using ECDLink.DataAccessLayer.Context;
using ECDLink.EGraphQL.Resolvers;
using HotChocolate.Resolvers;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.ContentManagement.GraphQL.Resolvers.FieldResolvers
{
    public class StaticRelationFieldResolver : FieldResolverBase, IDynamicFieldResolver
    {
        public object ResolveField(IPureResolverContext ctx, FieldDefinitionModel definition, int? contentTypeId = null)
        {
            var fieldValue = base.GetFieldValue(ctx, definition.Name);

            if (fieldValue == null)
            {
                return fieldValue;
            }

            var context = ctx.Service<AuthenticationDbContext>();

            var ids = base.ValueToGuidList(fieldValue);

            var entitiyName = definition.GraphDataTypeName.Substring(1, definition.GraphDataTypeName.Length - 2);

            Type type = AppDomain.CurrentDomain
                        .GetAssemblies()
                        .SelectMany(t => t.GetTypes())
                        .Where(t => String.Equals(t.Name, entitiyName, StringComparison.Ordinal)).First();

            var list = new List<object>();

            foreach (var id in ids)
            {
                list.Add(context.Find(type, id));
            }

            return list;
        }
    }
}
