using ECDLink.ContentManagement.GraphQL.Resolvers.FieldResolvers;
using ECDLink.EGraphQL.Enums;
using ECDLink.EGraphQL.Resolvers;
using System;

namespace ECDLink.ContentManagement.GraphQL.Resolvers
{
    public class FieldResolverFactory : IDynamicFieldResolverFactory
    {
        public IDynamicFieldResolver CreateFieldResolver(FieldTypeEnum fieldType)
        {
            switch (fieldType)
            {
                case FieldTypeEnum.Text:
                case FieldTypeEnum.Markdown:
                case FieldTypeEnum.Image:
                case FieldTypeEnum.Video:
                case FieldTypeEnum.DatePicker:
                case FieldTypeEnum.ColorPicker:
                    return new FieldResolver();
                case FieldTypeEnum.DynamicRelation:
                    return new DynamicRelationFieldResolver();
                case FieldTypeEnum.StaticRelation:
                    return new StaticRelationFieldResolver();
                default:
                    throw new NotImplementedException("No such field type specified");
            }
        }
    }
}
