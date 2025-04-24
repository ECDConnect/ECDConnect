using ECDLink.EGraphQL.Constants;
using ECDLink.Security.AccessModifiers.OpenAccess;
using ECDLink.Security.Enums;
using HotChocolate.Resolvers;
using System;
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

        public override async Task InvokeAsync(IDirectiveContext context)
        {
            var directive = context.Directive
                .ToObject<TokenAccessDirective>();

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