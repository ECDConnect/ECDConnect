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

        //public static bool IsInRole(this HttpContext context, string role)
        //{
        //  var roles = context.Items[Constants.ContextKeys.Roles].ToString();

        //  return roles.Contains(role) ? true : false;
        //}

        //public static bool IsUserAdmin(this HttpContext context)
        //{
        //  var roles = context.Items[Constants.ContextKeys.Roles].ToString();

        //  return roles.Contains(Constants.Roles.Admin) ? true : false;
        //}
    }
}
