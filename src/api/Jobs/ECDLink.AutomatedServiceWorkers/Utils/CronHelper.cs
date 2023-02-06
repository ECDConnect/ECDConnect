using Castle.Core.Logging;
using Cronos;
using ECDLink.AutomatedServiceWorkers.ExpireInvitations;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.PostgresTenancy.Services;
using ECDLink.Tenancy.Context;
using iTextSharp.text;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.AutomatedServiceWorkers.Util
{
    public class CronHelper
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

        public static List<ServiceScheduler> GetServiceJobs(HierarchyEngine hierarchyEngine, 
            IGenericRepositoryFactory repoFactory,  
            string jobName)
        {
            var adminId = hierarchyEngine.GetAdminUserId();
            var dbRepo = repoFactory.CreateGenericRepository<ServiceScheduler>(userContext: adminId);
            return dbRepo.GetAll().Where(x => x.Name == jobName).ToList();
        }
        public static void UpdateServiceJobResults(HierarchyEngine hierarchyEngine,
            IGenericRepositoryFactory repoFactory,
            ServiceScheduler serviceJob)
        {
            var adminId = hierarchyEngine.GetAdminUserId();
            var dbRepo = repoFactory.CreateGenericRepository<ServiceScheduler>(userContext: adminId);
            serviceJob.Results = "Success";
            serviceJob.EndTime = DateTime.Now;
            dbRepo.Update(serviceJob);
        }


    }
}
