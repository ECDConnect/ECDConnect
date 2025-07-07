using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Managers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
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

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.User.Identity.IsAuthenticated)
            {
                using var scope = context.RequestServices.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<AuthenticationDbContext>();

                var user = (from u in dbContext.Users
                            where u.Id.ToString() == context.User.Identity.Name
                            select new { u.Id, u.LastSeen }).FirstOrDefault();

                if (user != null)
                {
                    if (user.LastSeen.Date != DateTime.UtcNow.Date) 
                    {
                        dbContext.Database.ExecuteSqlInterpolated($"UPDATE \"AspNetUsers\" SET \"LastSeen\"={DateTime.UtcNow} WHERE \"Id\"={user.Id}");
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

