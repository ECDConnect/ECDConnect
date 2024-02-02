using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using Microsoft.Extensions.DependencyInjection; 
using System.Threading;
using System.Threading.Tasks;
using ECDLink.AutomatedJobs.Util;
using ECDLink.AutomatedJobs.Anonymise;
using Microsoft.Extensions.Logging;

namespace ECDLink.AutomatedJobs.DailyRunners;

public class AttendanceWeekly : CronJobService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IGenericRepositoryFactory _repoFactory;
    private readonly HierarchyEngine _hierarchyEngine;
    public AttendanceWeekly(IServiceScopeFactory scopeFactory, CronJobConfig<AttendanceWeekly> config, ILogger<AttendanceWeekly> logger)
            : base(config, logger)
    {
        _scopeFactory = scopeFactory;
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        using (var scope = _scopeFactory.CreateScope())
        {
            TenancyContext.SetTenantContext(scope);
            var service = scope.ServiceProvider.GetRequiredService<IIntegrationService>();
            if (service != null && service.Enabled)
            {
                await service.IntegrationAttendanceByDueData();
                await service.IntegrationLeagueData();
            }
        }
    }
}
