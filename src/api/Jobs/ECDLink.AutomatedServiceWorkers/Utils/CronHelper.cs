using Cronos;
using ECDLink.PostgresTenancy.Services;
using ECDLink.Tenancy.Context;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace ECDLink.AutomatedServiceWorkers.Util
{
    public static class CronHelper
    {
        public static DateTimeOffset? NextOccurance(string cronTag)
        {
            var expression = CronExpression.Parse(cronTag);

            return expression.GetNextOccurrence(DateTimeOffset.Now, TimeZoneInfo.Local);
        }

        public static void SetTenantContext(IServiceScope scope, string tenantId)
        {
            var tenancyRepo = scope.ServiceProvider.GetRequiredService<TenantService>();

            var tenant = tenancyRepo.GetTenantById(tenantId);

            TenantExecutionContext.SetTenant(tenant);
        }
    }
}
