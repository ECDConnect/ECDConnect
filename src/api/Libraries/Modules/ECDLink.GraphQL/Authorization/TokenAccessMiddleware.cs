using ECDLink.EGraphQL.Constants;
using ECDLink.Security.AccessModifiers.OpenAccess;
using ECDLink.Security.Enums;
using HotChocolate.Resolvers;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.EGraphQL.Authorization
{
    public class TokenAccessMiddleware : AuthorizationMiddlewareBase
    {
        private readonly FieldDelegate _next;

        public TokenAccessMiddleware(FieldDelegate next)
        {
            _next = next ?? throw new ArgumentNullException(nameof(next));
        }

        public override async Task InvokeAsync(IMiddlewareContext context)
        {
            // Retrieve the "token" directive from the selection's syntax node
            var directiveNode = context.Selection.SyntaxNode
                .Directives.FirstOrDefault(d => d.Name.Value == "token");

            if (directiveNode == null)
            {
                // If the directive is not present, simply proceed with the next middleware
                await _next(context).ConfigureAwait(false);
                return;
            }

            // Extract the "Validator" argument from the directive
            var validatorTypeName = directiveNode.Arguments
                .FirstOrDefault(a => a.Name.Value == "Validator")?.Value.Value?.ToString();

            if (string.IsNullOrEmpty(validatorTypeName))
            {
                SetError(context, AuthState.NotAllowed);
                return;
            }

            // Create a new TokenAccessDirective instance using the extracted validator type
            var tokenDirective = new TokenAccessDirective
            {
                Validator = Type.GetType(validatorTypeName)
            };

            // Use the validator as per the original logic
            var validatorType = typeof(IOpenAccessValidator<>).MakeGenericType(tokenDirective.Validator);
            var validator = context.Services.GetService(validatorType);

            if (validator == null)
            {
                SetError(context, AuthState.NotAllowed);
                return;
            }

            var token = context.ArgumentValue<string>(ArgumentConstants.Token);
            var method = validator.GetType().GetMethod("ValidateToken");

            if (method == null)
            {
                SetError(context, AuthState.NotAllowed);
                return;
            }

            var state = (AuthState)method.Invoke(validator, new object[] { token });

            if (state == AuthState.Allowed)
            {
                await _next(context).ConfigureAwait(false);
            }
            else
            {
                SetError(context, state);
            }
        }
    }
}
