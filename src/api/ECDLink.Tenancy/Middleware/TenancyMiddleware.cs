using ECDLink.Tenancy.Context;
using ECDLink.Tenancy.Exceptions;
using ECDLink.Tenancy.Model;
using ECDLink.Tenancy.Services;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
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
            string path = "";
            TenantInternalModel tenant = null;

            var claim = context.User.Claims
                                .Where(x => string.Equals(x.Type, TenancyConstants.Jwt.TenantJwtClaim))
                                .FirstOrDefault();
            // Check url making request
            var refererUrl = context?.Request?.GetTypedHeaders()?.Referer?.AbsoluteUri ?? (context.Request.Host.HasValue ? context.Request.Host.Value : String.Empty);

            if (!string.IsNullOrWhiteSpace(refererUrl))
            {
                var urlTenant = tenancyService.GetTenantByUrl(refererUrl);
                if (urlTenant != null && urlTenant != default(TenantInternalModel))
                {
                    tenant = urlTenant;
                    path = "URL:" + refererUrl;
                }
            }
            else
            {
                // If no url making the request, check the server the request was made to            
                var host = tenancyService.GetTenantByUrl(context.Request.Host.Value);
                if (host != default(TenantInternalModel))
                {
                    tenant = host;
                    path = "Host:" + context.Request.Host.Value;
                }
            }

            // If there is a jwt, check it matches with the url resolved.
            if (!string.IsNullOrEmpty(claim?.Value) && claim?.Value != "00000000-0000-0000-0000-000000000000" && tenant != null)
            {
                if (tenant.Id.ToString() == claim.Value)
                {
                    path = "JWT:" + claim?.Value;
                }
                else
                {
                    tenant = null;
                }
            }

            if (tenant != null)
            {
                tenant.Path = path;
                tenant.Host = context.Request.Host.Value;
            }

            return (tenant != null ? tenant : new TenantInternalModel());
        }
    }
}
