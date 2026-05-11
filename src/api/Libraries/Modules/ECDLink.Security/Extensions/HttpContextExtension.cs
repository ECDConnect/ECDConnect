using System;
using System.Linq;
using ECDLink.Core.Models;
using ECDLink.Tenancy.Context;
using ECDLink.Tenancy.Model;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
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

        public static bool GetUserSupportPersistedQueries(this HttpContext context)
        {
            var claim = context.User.Claims.FirstOrDefault(x => x.Type == JwtClaimIdentifiers.PersistedQuery);
            if (string.IsNullOrWhiteSpace(claim?.Value)) return false;
            return bool.Parse(claim.Value);
        }

        public static TenantInternalModel GetTenant(this HttpContext context)
        {
            var tenantId = GetUserTenant(context);
            var tenant = TenantExecutionContext.Tenant;
            if (string.IsNullOrEmpty(tenantId)) return tenant;
            if (tenant.Id.ToString() != tenantId) return null;
            return tenant;
        }

        public static bool IsTenantAdminPortal(this HttpContext context)
        {
            var tenant = GetTenant(context);
            if (tenant == null) return false;
            var url = context?.Request?.GetTypedHeaders()?.Referer?.AbsoluteUri
                ?? (string.IsNullOrEmpty(context.Request.Headers.Origin.ToString()) ? null : context.Request.Headers.Origin.ToString())
                ?? (context.Request.Host.HasValue ? context.Request.Host.Value : String.Empty);
            return url.Contains(tenant.AdminSiteAddress) || url.Contains(tenant.AdminTestSiteAddress);
        }

        public static bool IsBackend(this HttpContext context)
        {
            var tenant = GetTenant(context);
            if (tenant == null) return false;
            return (tenant.AdminSiteAddress == "none");
        }
    }
}
