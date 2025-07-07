using ECDLink.EGraphQL.Enums;

namespace ECDLink.EGraphQL.Resolvers
{
    public interface IDynamicFieldResolverFactory
    {
        public IDynamicFieldResolver CreateFieldResolver(FieldTypeEnum fieldType);
    }
}
