using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.PostgresTenancy.Services;
using ECDLink.Tenancy.Context;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.DailyRunners;

public class IntegrationChanges : CronJobService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IGenericRepositoryFactory _repoFactory;
    private readonly HierarchyEngine _hierarchyEngine;
    public IntegrationChanges(IServiceScopeFactory scopeFactory, IScheduleConfig<ExpireInvitations> config/*, IGenericRepositoryFactory repoFactory, HierarchyEngine hierarchyEngine*/)
        : base(config.CronExpression, config.TimeZoneInfo)
    {
        _scopeFactory = scopeFactory;
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        using (var scope = _scopeFactory.CreateScope())
        {
            //var service = scope.ServiceProvider.GetRequiredService<>(IIntegrationService);

            //SetTenantContext(scope);            

            //service.ExpireRelationshipLinks();
        }
    }

    // TODO: Convert to multi-tenancy jobs
    //Single Tenant for now
    private void SetTenantContext(IServiceScope scope)
    {
        var tenancyRepo = scope.ServiceProvider.GetRequiredService<TenantService>();

        var tenant = tenancyRepo.GetAllTenants()
            .Where(x => x.TenantType == Tenancy.Enums.TenantType.Tenant)
            .OrderBy(x => x.Id)
            .FirstOrDefault();

        TenantExecutionContext.SetTenant(tenant);
    }
}
