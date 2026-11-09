using ECDLink.Security.Enums;
using ECDLink.Security.JwtSecurity.Managers;
using ECDLink.Security.Managers;
using HotChocolate.Resolvers;
using HotChocolate.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ECDLink.EGraphQL.Authorization
{
    internal sealed class PermissionMiddleware : AuthorizationMiddlewareBase
    {
        private readonly FieldDelegate _next;
        private readonly IAuthorizationManager _authorizationManager;
        private readonly IClaimsManager _claimsManager;
        public JwtTokenManager _jwtTokenManager { get; set; }

        public PermissionMiddleware(FieldDelegate next, IAuthorizationManager authorizationManager, IClaimsManager claimsManager,
          JwtTokenManager tokenManager)
        {
            _next = next ?? throw new ArgumentNullException(nameof(next));
            _authorizationManager = authorizationManager;
            _claimsManager = claimsManager;
            _jwtTokenManager = tokenManager;
        }

        /// The directive name as declared in PermissionDirectiveType.
        private const string DirectiveName = "permission";

        public override async Task InvokeAsync(IMiddlewareContext context)
        {
            // v12 read this off IDirectiveContext, which handed over the directive belonging to
            // the field being executed. v13 removed that type, and taking a Directive by
            // constructor injection instead binds ONE directive for the middleware's lifetime -
            // so every field ended up authorised against some other field's permission
            // (userById was checking view_registration). Read them from the executing field
            // instead, and require all of them, which is what v12 achieved by running this
            // middleware once per directive application.
            foreach (var directive in GetPermissionDirectives(context))
            {
                var state = ValidateResult(context, directive);

                if (state != AuthState.Allowed)
                {
                    SetError(context, state);
                    return;
                }
            }

            await _next(context).ConfigureAwait(false);
        }

        private static IEnumerable<PermissionDirective> GetPermissionDirectives(IMiddlewareContext context)
            => context.Selection.Field.Directives
                .Where(d => string.Equals(d.Type.Name, DirectiveName, StringComparison.Ordinal))
                .Select(d => d.ToValue<PermissionDirective>());

        private AuthState ValidateResult(IMiddlewareContext context, PermissionDirective directive)
        {
            // If no directive is set, assume end point is completely open
            if (directive == default(PermissionDirective))
            {
                return AuthState.Allowed;
            }

            // If Object is *, end point is completely open
            if (string.Equals(directive.ObjectType, "*"))
            {
                return AuthState.Allowed;
            }

            if (!context.ContextData.Any())
            {
                return AuthState.NotAuthenticated;
            }

            var roles = GetClaimRoles(context);

            if (!_authorizationManager.HasPermission(roles.ToArray(), directive.GetPermissionAction()))
            {
                return AuthState.NotAllowed;
            }

            return AuthState.Allowed;
        }

        private List<string> GetClaimRoles(IMiddlewareContext context)
        {
            ClaimsPrincipal principal;

            if (!_claimsManager.TryGetAuthenticatedPrincipal(context?.ContextData, out principal))
            {
                // No principle
                return new List<string>();
            }

            //TODO: CB Remove ROL again when portal login errors have been resolved
            return _claimsManager.GetClaimRoles(principal); //to remove obfuscation

        }
    }
}
