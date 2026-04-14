using ECDLink.ContentManagement.GraphQL.Resolvers.FieldResolvers.Base;
using ECDLink.Core.Models.ContentManagement;
using ECDLink.DataAccessLayer.Context;
using ECDLink.EGraphQL.Resolvers;
using HotChocolate.Resolvers;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.ContentManagement.GraphQL.Resolvers.FieldResolvers
{
    public class StaticRelationFieldResolver : FieldResolverBase, IDynamicFieldResolver
    {
        // Assembly scanning is expensive — cache the result per entity name across all requests
        private static readonly ConcurrentDictionary<string, Type> _typeCache = new();

        public object ResolveField(IPureResolverContext ctx, FieldDefinitionModel definition, int? contentTypeId = null)
        {
            var fieldValue = base.GetFieldValue(ctx, definition.Name);

            if (fieldValue == null)
            {
                return fieldValue;
            }

            var context = ctx.Service<AuthenticationDbContext>();

            var ids = base.ValueToGuidList(fieldValue);

            var entityName = definition.GraphDataTypeName.Substring(1, definition.GraphDataTypeName.Length - 2);

            var type = _typeCache.GetOrAdd(entityName, name =>
                AppDomain.CurrentDomain
                    .GetAssemblies()
                    .SelectMany(a => a.GetTypes())
                    .First(t => string.Equals(t.Name, name, StringComparison.Ordinal)));

            var list = new List<object>();

            foreach (var id in ids)
            {
                list.Add(context.Find(type, id));
            }

            return list;
        }
    }
}
