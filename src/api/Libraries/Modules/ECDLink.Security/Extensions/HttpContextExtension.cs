using System;
using System.Linq;
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

        public static Guid? GetUserId(this HttpContext context)
        {
            var claim = context.User.Claims.FirstOrDefault(x => x.Type == SecurityConstants.Strings.JwtClaimIdentifiers.Id);
            if (string.IsNullOrWhiteSpace(claim?.Value)) return null;
            return Guid.Parse(claim.Value);
        }

        public static bool IsAdmin(this HttpContext context)
        {
            return context.User.HasClaim(JwtClaimIdentifiers.Rol, Roles.ADMINISTRATOR);
        }

        public static bool IsInRole(this HttpContext context, string role)
        {
            return context.User.HasClaim(JwtClaimIdentifiers.Rol, role);
        }

        public static bool IsInRole(this HttpContext context, string[] roles)
        {
            foreach (var role in roles)
            {
                if (context.User.HasClaim(JwtClaimIdentifiers.Rol, role))
                {
                    return true;
                }
            }
            return false;
        }

        public static string GetUserTenant(this HttpContext context)
        {
            return context.Request.Headers.ContainsKey(JwtClaimIdentifiers.TenantId)
                ? context.Request.Headers[JwtClaimIdentifiers.TenantId].ToString()
                : string.Empty;
        }
    }
}
