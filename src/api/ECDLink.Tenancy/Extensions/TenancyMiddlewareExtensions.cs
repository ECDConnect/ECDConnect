using ECDLink.Tenancy.EntityFramework;
using ECDLink.Tenancy.Middleware;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

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
