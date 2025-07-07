using ECDLink.Core.Models;
using Microsoft.AspNetCore.Http;
using static ECDLink.Security.SecurityConstants.Strings;

namespace ECDLink.Security.Extensions
{
    public static class HttpContextExtension
    {
        public static ApplicationIdentityUser GetUser(this HttpContext context)
        {
            return context != null ? context.Items[SecurityConstants.ContextKeys.User] as ApplicationIdentityUser : null;
        }


        public static bool IsAdmin(this HttpContext context)
        {
            return context.User.HasClaim(JwtClaimIdentifiers.Rol, Roles.ADMINISTRATOR);
        }

        public static bool IsInRole(this HttpContext context, string role)
        {
            return context.User.HasClaim(JwtClaimIdentifiers.Rol, role);
        }

        public static string GetUserTenant(this HttpContext context)
        {
            return context.Request.Headers.ContainsKey(JwtClaimIdentifiers.TenantId)
                ? context.Request.Headers[JwtClaimIdentifiers.TenantId].ToString()
                : string.Empty;
        }
    }
}
