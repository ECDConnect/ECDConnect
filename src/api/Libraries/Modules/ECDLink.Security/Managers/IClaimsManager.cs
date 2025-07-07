using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Security.Claims;

namespace ECDLink.Security.Managers
{
    public interface IClaimsManager
    {
        bool TryGetAuthenticatedPrincipal(IDictionary<string, object> context, out ClaimsPrincipal principal);

        T GetClaimUser<T>(ClaimsPrincipal principal) where T : IdentityUser<Guid>;

        List<string> GetClaimRoles(ClaimsPrincipal principal);

        bool IsValidPrincipal(ClaimsPrincipal principal);

        ClaimsIdentity GenerateClaimsIdentity(string userName, params Claim[] claims);
    }
}
