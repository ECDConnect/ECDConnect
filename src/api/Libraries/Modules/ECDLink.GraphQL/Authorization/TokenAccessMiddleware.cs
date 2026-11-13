using ECDLink.EGraphQL.Constants;
using ECDLink.Security.AccessModifiers.OpenAccess;
using ECDLink.Security.Enums;
using HotChocolate.Resolvers;
using HotChocolate.Types;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.EGraphQL.Authorization
{
    public class TokenAccessMiddleware : AuthorizationMiddlewareBase
    {
        private readonly FieldDelegate _next;

        /// The directive name as declared in TokenAccessDirectiveType.
        private const string DirectiveName = "token";

        public TokenAccessMiddleware(FieldDelegate next)
        {
            _next = next ?? throw new ArgumentNullException(nameof(next));
        }

        public override async Task InvokeAsync(IMiddlewareContext context)
        {
            // Same fix as PermissionMiddleware: the directive has to come from the field being
            // executed, not from one captured when the middleware was built. Latent here today -
            // nothing in the schema applies @token - but wrong for the same reason.
            var directive = context.Selection.Field.Directives
                .Where(d => string.Equals(d.Type.Name, DirectiveName, StringComparison.Ordinal))
                .Select(d => d.ToValue<TokenAccessDirective>())
                .FirstOrDefault();

            if (directive is null)
            {
                await _next(context).ConfigureAwait(false);
                return;
            }

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
