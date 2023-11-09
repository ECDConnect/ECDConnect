using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using Microsoft.Extensions.DependencyInjection; 
using System.Threading;
using System.Threading.Tasks;
using ECDLink.AutomatedJobs.Util;

namespace ECDLink.AutomatedJobs.DailyRunners;

public class IntegrationChanges : CronJobService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IGenericRepositoryFactory _repoFactory;
    private readonly HierarchyEngine _hierarchyEngine;
    public IntegrationChanges(IServiceScopeFactory scopeFactory, IScheduleConfig<IntegrationChanges> config/*, IGenericRepositoryFactory repoFactory, HierarchyEngine hierarchyEngine*/)
        : base(config)
    {
        _scopeFactory = scopeFactory;
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        using (var scope = _scopeFactory.CreateScope())
        {
            TenancyContext.SetTenantContext(scope);
            var service = scope.ServiceProvider.GetRequiredService<IIntegrationService>();

            await service.IntegrationUpdates();
        }
    }
}
