using ECDLink.Tenancy.Context;
using ECDLink.Tenancy.Exceptions;
using ECDLink.Tenancy.Model;
using ECDLink.Tenancy.Services;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Security.Policy;
using System.Threading.Tasks;

namespace ECDLink.Tenancy.Middleware
{
    public class TenancyMiddleware
    {
        private readonly RequestDelegate _next;

        public TenancyMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, ITenantService tenancyService)
        {
            string path = context.Request.Path;
            if (!path.Contains("/authentication/online-check"))
            {
                var tenantModel = GetTenant(context, tenancyService);

                if (tenantModel == null)
                {
                    throw new TenantNotFoundException();
                }

                // Add the tenant to the ambient context to use for DB injection
                TenantExecutionContext.SetTenant(tenantModel);
            }
            else
            {
                TenantExecutionContext.SetTenant(null, true);
            }
            // Call the next delegate/middleware in the pipeline.
            await _next(context);
        }

        private TenantInternalModel GetTenant(HttpContext context, ITenantService tenancyService)
        {
            TenantInternalModel tenant = null;

            var claim = context.User.Claims
                                .Where(x => string.Equals(x.Type, TenancyConstants.Jwt.TenantJwtClaim))
                                .FirstOrDefault();
            if (claim != null && claim.Value.Length > 0)
            {
                tenant = tenancyService.GetTenantByKey(claim.Value);
            }

            if (tenant == null)
            {
                // Check url making request
                var refererUrl = context?.Request?.GetTypedHeaders()?.Referer?.AbsoluteUri ?? (context.Request.Host.HasValue ? context.Request.Host.Value : String.Empty);
                if (!string.IsNullOrWhiteSpace(refererUrl))
                {
                    tenant = tenancyService.GetTenantByUrl(refererUrl);
                }
            }

            return (tenant != null ? tenant : new TenantInternalModel());
        }
    }
}
