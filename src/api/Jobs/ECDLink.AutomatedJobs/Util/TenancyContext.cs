using Cronos;
using ECDLink.PostgresTenancy.Services;
using ECDLink.Tenancy.Context;
using Microsoft.Extensions.DependencyInjection;
using SmartStart.Integration;
using System;
using System.Linq;

namespace ECDLink.AutomatedJobs.Util
{
    public class TenancyContext
    {
        public static void SetTenantContext(IServiceScope scope, string tenantGuid = Constants.ApplicationSettings.DefaultTenant)
        {
            var tenancyRepo = scope.ServiceProvider.GetRequiredService<TenantService>();

            var tenant = tenancyRepo.GetAllTenants()
                .Where(x => x.TenantType == Tenancy.Enums.TenantType.Tenant && x.Id.Equals(Guid.Parse(tenantGuid)))
                .OrderBy(x => x.Id)
                .FirstOrDefault();

            TenantExecutionContext.SetTenant(tenant);
        }
    }
}
