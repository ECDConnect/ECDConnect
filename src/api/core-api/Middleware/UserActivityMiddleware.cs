using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Managers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Middleware
{
    public class UserActivityMiddleware
    {
        private readonly RequestDelegate _next;

        public UserActivityMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context,  AuthenticationDbContext dbContext, ApplicationUserManager userManager)
        {
            if (context.User.Identity.IsAuthenticated)
            {
                var user = await userManager.GetUserAsync(context.User);
                if (user != null)
                {
                    if (user.LastSeen.Date != DateTime.Now.Date) 
                    {
                        user.LastSeen = DateTime.UtcNow;
                        await dbContext.SaveChangesAsync();
                    }
                }
            }
            await _next(context);
        }
    }

    public static class UserActivityMiddlewareExtensions
    {
        public static IApplicationBuilder UseUserActivity(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<UserActivityMiddleware>();
        }
    }
}

