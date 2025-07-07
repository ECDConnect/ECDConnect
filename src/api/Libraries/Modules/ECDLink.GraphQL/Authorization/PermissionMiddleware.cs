using ECDLink.Security.Enums;
using ECDLink.Security.JwtSecurity.Managers;
using ECDLink.Security.Managers;
using HotChocolate.Resolvers;
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

        public override async Task InvokeAsync(IDirectiveContext context)
        {
            PermissionDirective directive = context.Directive
                .ToObject<PermissionDirective>();

            var state = ValidateResult(context, directive);

            if (state == AuthState.Allowed)
            {
                await _next(context).ConfigureAwait(false);
            }
            else
            {
                SetError(context, state);
            }
        }

        private AuthState ValidateResult(IDirectiveContext context, PermissionDirective directive)
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

        private List<string> GetClaimRoles(IDirectiveContext context)
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