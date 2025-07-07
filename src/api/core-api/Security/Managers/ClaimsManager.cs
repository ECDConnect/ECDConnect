using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.Security;
using ECDLink.Security.Managers;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;

namespace EcdLink.Api.CoreApi.Security.Managers
{
    public class ClaimsManager : IClaimsManager
    {
        private readonly ApplicationUserManager _userManager;

        public ClaimsManager(ApplicationUserManager userManager)
        {
            _userManager = userManager;
        }

        public bool TryGetAuthenticatedPrincipal(
           IDictionary<string, object> context,
           out ClaimsPrincipal principal)
        {
            if (context.TryGetValue(nameof(ClaimsPrincipal), out var o)
                && o is ClaimsPrincipal p
                && p.Identities.Any(t => t.IsAuthenticated))
            {
                principal = p;
                return true;
            }

            principal = null;
            return false;
        }


        public T GetClaimUser<T>(ClaimsPrincipal principal)
            where T : IdentityUser<Guid>
        {
            if (!IsValidPrincipal(principal))
            {
                return default;
            }

            var idClaim = principal.Claims.FirstOrDefault(x => string.Equals(x.Type, SecurityConstants.Strings.JwtClaimIdentifiers.Id));

            if (string.IsNullOrWhiteSpace(idClaim?.Value))
            {
                return default;
            }

            return _userManager.FindByIdAsync(idClaim.Value).Result as T;
        }

        public List<string> GetClaimRoles(ClaimsPrincipal principal)
        {
            if (!IsValidPrincipal(principal))
            {
                return new List<string>();
            }

            var roleClaim = principal.Claims.FirstOrDefault(claim => string.Equals(claim.Type, SecurityConstants.Strings.JwtClaimIdentifiers.Rol));

            if (string.IsNullOrWhiteSpace(roleClaim?.Value))
            {
                return new List<string>();
            }

            return roleClaim.Value.Split(',').ToList();
        }

        public bool IsValidPrincipal(ClaimsPrincipal principal)
        {
            if (!(principal?.Claims.Any() ?? false))
            {
                return false;
            }

            return true;
        }

        public ClaimsIdentity GenerateClaimsIdentity(string userName, params Claim[] claims)
        {
            return new ClaimsIdentity(new GenericIdentity(userName, "Token"), claims);
        }
    }
}
