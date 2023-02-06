using HotChocolate.Types;

namespace ECDLink.EGraphQL.Authorization
{
    public class TokenAccessDirectiveType : DirectiveType<TokenAccessDirective>
    {
        protected override void Configure(IDirectiveTypeDescriptor<TokenAccessDirective> descriptor)
        {
            descriptor
                .Name("token")
                .Location(DirectiveLocation.Schema)
                .Location(DirectiveLocation.FieldDefinition)
                .Repeatable();

            descriptor.Use<TokenAccessMiddleware>();
        }
    }
}
