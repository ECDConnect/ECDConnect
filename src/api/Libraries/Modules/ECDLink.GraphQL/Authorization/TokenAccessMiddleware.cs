using ECDLink.EGraphQL.Constants;
using ECDLink.Security.AccessModifiers.OpenAccess;
using ECDLink.Security.Enums;
using HotChocolate.Resolvers;
using HotChocolate.Types;
using System;
using System.Threading.Tasks;

namespace ECDLink.EGraphQL.Authorization
{
    public class TokenAccessMiddleware : AuthorizationMiddlewareBase
    {
        private readonly FieldDelegate _next;

        // v13 removed IDirectiveContext: the directive is handed to the middleware when it is
        // built rather than read off the execution context.
        private readonly Directive _directive;

        public TokenAccessMiddleware(FieldDelegate next, Directive directive)
        {
            _next = next ?? throw new ArgumentNullException(nameof(next));
            _directive = directive ?? throw new ArgumentNullException(nameof(directive));
        }

        public override async Task InvokeAsync(IMiddlewareContext context)
        {
            var directive = _directive.AsValue<TokenAccessDirective>();

            var validatorType = typeof(IOpenAccessValidator<>).MakeGenericType(directive.Validator);

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