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
                TenantModel tenantModel = GetTenant(context, tenancyService);

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

        private TenantModel GetTenant(HttpContext context, ITenantService tenancyService)
        {
            string path = "";
            TenantModel tenant = new TenantModel();

            var claim = context.User.Claims
                                .Where(x => string.Equals(x.Type, TenancyConstants.Jwt.TenantJwtClaim))
                                .FirstOrDefault();

            // If there is a jwt, automatically just use it
            if (!string.IsNullOrEmpty(claim?.Value) && claim?.Value != "00000000-0000-0000-0000-000000000000")
            {
                var idTenant = tenancyService.GetTenantById(claim.Value);
                if (idTenant != null && idTenant != default(TenantModel))
                    tenant = idTenant;

                path = "JWT:" + claim?.Value;

            }
            else
            {

                // Check url making request
                var refererUrl = context?.Request?.GetTypedHeaders()?.Referer?.AbsoluteUri ?? (context.Request.Host.HasValue ? context.Request.Host.Value : String.Empty);
                Console.WriteLine("TenancyMiddleware:GetTenant: refererUrl={0}", refererUrl);
                if (!string.IsNullOrWhiteSpace(refererUrl))
                {
                    var urlTenant = tenancyService.GetTenantByUrl(refererUrl);
                    if (urlTenant != null && urlTenant != default(TenantModel))
                    {
                        tenant = urlTenant;
                        path = "URL:" + refererUrl;
                    }
                }
                else
                {
                    // If no url making the request, check the server the request was made to            
                    var host = tenancyService.GetTenantByUrl(context.Request.Host.Value);
                    if (host != default(TenantModel))
                    {
                        tenant = host;
                        path = "Host:" + context.Request.Host.Value;
                    }
                }
            }
            tenant.Var1 = path;
            tenant.Var2 = context.Request.Host.Value;

            return (tenant != null ? tenant : new TenantModel());
        }
    }
}
