using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using Microsoft.Extensions.DependencyInjection; 
using System.Threading;
using System.Threading.Tasks;
using ECDLink.AutomatedJobs.Util;

namespace ECDLink.AutomatedJobs.DailyRunners;

public class AttendanceWeekly : CronJobService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IGenericRepositoryFactory _repoFactory;
    private readonly HierarchyEngine _hierarchyEngine;
    public AttendanceWeekly(IServiceScopeFactory scopeFactory, IScheduleConfig<AttendanceWeekly> config)
        : base(config.CronExpression, config.TimeZoneInfo)
    {
        _scopeFactory = scopeFactory;
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        using (var scope = _scopeFactory.CreateScope())
        {
            TenancyContext.SetTenantContext(scope);
            var service = scope.ServiceProvider.GetRequiredService<IIntegrationService>();

          await service.IntegrationAttendanceByDueData();
        }
    }
}
