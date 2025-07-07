using ECDLink.Abstractrions.GraphQL.Enums;
using HotChocolate.Types;

namespace ECDLink.EGraphQL.Authorization
{
    public class PermissionDirectiveType : DirectiveType<PermissionDirective>
    {
        protected override void Configure(IDirectiveTypeDescriptor<PermissionDirective> descriptor)
        {
            descriptor
                .Name("permission")
                .Location(DirectiveLocation.Schema)
                .Location(DirectiveLocation.Object)
                .Location(DirectiveLocation.FieldDefinition)
                .Repeatable();

            descriptor.Argument(t => t.ObjectType)
                .Type<StringType>();

            descriptor.Argument(t => t.MethodType)
                .Type<EnumType<GraphActionEnum>>();

            descriptor.Use<PermissionMiddleware>();
        }
    }
}
