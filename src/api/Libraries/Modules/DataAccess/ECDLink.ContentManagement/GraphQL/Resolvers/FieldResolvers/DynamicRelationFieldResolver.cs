using ECDLink.ContentManagement.GraphQL.Resolvers.FieldResolvers.Base;
using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Models.ContentManagement;
using ECDLink.EGraphQL.Resolvers;
using HotChocolate.Resolvers;

namespace ECDLink.ContentManagement.GraphQL.Resolvers.FieldResolvers
{
    public class DynamicRelationFieldResolver : FieldResolverBase, IDynamicFieldResolver
    {
        public object ResolveField(IPureResolverContext ctx, FieldDefinitionModel definition, int? contentTypeId = null)
        {
            var fieldValue = base.GetFieldValue(ctx, definition.Name);

            if (fieldValue == null)
            {
                return fieldValue;
            }

            var repository = ctx.Service<ContentManagementRepository>();

            return repository.GetByIds(contentTypeId.Value, base.GetContextLocale(ctx), base.ValueToList(fieldValue));
        }
    }
}
