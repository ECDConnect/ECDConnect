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
            // Since `IMiddlewareContext` does not support `Directive`, you need to pass the directive explicitly
            var directive = context.Selection.SyntaxNode.Directives
                .FirstOrDefault(d => d.Name.Value == "tokenAccess");

            if (directive == null)
            {
                await _next(context).ConfigureAwait(false);
                return;
            }

            // Extract the validator type and other properties safely
            var directiveArgs = directive.Arguments
                .ToDictionary(arg => arg.Name.Value, arg => arg.Value.Value);

            var validatorType = Type.GetType(directiveArgs["validator"].ToString());
            var validator = context.Services.GetService(validatorType);

            var token = context.ArgumentValue<string>(ArgumentConstants.Token);
            var method = validator.GetType().GetMethod("ValidateToken");

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
