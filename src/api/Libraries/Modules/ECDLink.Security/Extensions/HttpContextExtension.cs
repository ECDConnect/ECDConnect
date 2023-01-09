using ECDLink.Core.Models;
using Microsoft.AspNetCore.Http;

namespace ECDLink.Security.Extensions
{
    public static class HttpContextExtension
    {
        public static ApplicationIdentityUser GetUser(this HttpContext context)
        {
            return context.Items[SecurityConstants.ContextKeys.User] as ApplicationIdentityUser;
        }
        public static bool IsAdmin(this HttpContext context)
        {
            return context.User.HasClaim("rol", Roles.ADMINISTRATOR);
        }

        public static bool IsInRole(this HttpContext context, string role)
        {
            return context.User.HasClaim("rol", role);
        }
    }
}
