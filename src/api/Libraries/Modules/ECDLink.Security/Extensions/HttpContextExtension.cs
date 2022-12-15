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
    }
}
