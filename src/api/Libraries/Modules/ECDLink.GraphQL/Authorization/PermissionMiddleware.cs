using ECDLink.Security.Enums;
using ECDLink.Security.JwtSecurity.Managers;
using ECDLink.Security.Managers;
using HotChocolate.Resolvers;
using HotChocolate.Language;
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

        public override async Task InvokeAsync(IMiddlewareContext context)
        {
            // Fetching directive data from the selection syntax node
            var permissionDirective = context.Selection.SyntaxNode
                .Directives.FirstOrDefault(d => d.Name.Value == "permission");

            if (permissionDirective == null)
            {
                await _next(context).ConfigureAwait(false);
                return;
            }

            // Parsing directive arguments safely
            var directiveValues = permissionDirective.Arguments.ToDictionary(
                arg => arg.Name.Value,
                arg => arg.Value);

            var objectType = directiveValues.ContainsKey("objectType") ? directiveValues["objectType"].ToString() : "*";

            var directive = new PermissionDirective
            {
                ObjectType = objectType
            };

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

        private AuthState ValidateResult(IMiddlewareContext context, PermissionDirective directive)
        {
            if (directive == default(PermissionDirective))
            {
                return AuthState.Allowed;
            }

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

            if (!_claimsManager.TryGetAuthenticatedPrincipal(context.ContextData, out principal))
            {
                return new List<string>();
            }

            return _claimsManager.GetClaimRoles(principal);
        }
    }
}
