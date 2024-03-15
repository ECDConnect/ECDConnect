//using ECDLink.PostgresTenancy.Services;
//using ECDLink.Tenancy.Context;
//using Microsoft.Extensions.DependencyInjection;
//using System;
//using System.Linq;

//namespace ECDLink.AutomatedJobs.Util
//{
//    public class TenancyContext
//    {
//        public static void SetTenantContext(IServiceScope scope, string tenantGuid = "258a15e6-3736-45ea-875c-48d9377de4c8")
//        {
//            var tenancyRepo = scope.ServiceProvider.GetRequiredService<TenantService>();

//            var tenant = tenancyRepo.GetAllTenants()
//                .Where(x => x.TenantType == Tenancy.Enums.TenantType.Tenant && x.Id == Guid.Parse(tenantGuid))
//                .OrderBy(x => x.Id)
//                .FirstOrDefault();

//            TenantExecutionContext.SetTenant(tenant);
//        }
//    }
//}
