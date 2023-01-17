using ECDLink.Tenancy.Middleware;
using Microsoft.AspNetCore.Builder;

namespace ECDLink.Tenancy.Extensions
{
    public static class TenancyMiddlewareExtensions
    {
        public static IApplicationBuilder UseTenancy(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<TenancyMiddleware>();
        }
    }
}
