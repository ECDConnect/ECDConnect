using ECDLink.Abstractrions.GraphQL.Enums;
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

        public override async Task InvokeAsync(IMiddlewareContext context)
        {
            // Retrieve the "permission" directive from the selection's syntax node
            var directiveNode = context.Selection.SyntaxNode
                .Directives.FirstOrDefault(d => d.Name.Value == "permission");

            if (directiveNode == null)
            {
                // If the directive is not present, proceed with the next middleware
                await _next(context).ConfigureAwait(false);
                return;
            }

            // Extract and manually map the directive's arguments to the PermissionDirective instance
            var directive = new PermissionDirective
            {
                ObjectType = directiveNode.Arguments
                    .FirstOrDefault(a => a.Name.Value == "ObjectType")?.Value?.ToString(),
                MethodType = (GraphActionEnum)Enum.Parse(typeof(GraphActionEnum),
                    directiveNode.Arguments.FirstOrDefault(a => a.Name.Value == "MethodType")?.Value?.ToString() ?? "View")
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
            // If no directive is set, assume endpoint is completely open
            if (directive == null)
            {
                return AuthState.Allowed;
            }

            // If ObjectType is *, endpoint is completely open
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
            if (!_claimsManager.TryGetAuthenticatedPrincipal(context.ContextData, out ClaimsPrincipal principal))
            {
                // No principal found
                return new List<string>();
            }

            return _claimsManager.GetClaimRoles(principal); // Retrieve roles
        }
    }
}
