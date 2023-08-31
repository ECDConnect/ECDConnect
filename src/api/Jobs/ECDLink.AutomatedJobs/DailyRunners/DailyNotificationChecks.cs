using ECDLink.AutomatedJobs.Cron;
using ECDLink.AutomatedJobs.Util;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.DailyRunners;

public class DailyNotificationChecks : CronJobService
{
    private readonly IServiceScopeFactory _scopeFactory;
    public DailyNotificationChecks(IServiceScopeFactory scopeFactory, IScheduleConfig<DailyNotificationChecks> config)
        : base(config.CronExpression, config.TimeZoneInfo)
    {
        _scopeFactory = scopeFactory;
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        using (var scope = _scopeFactory.CreateScope())
        {
            TenancyContext.SetTenantContext(scope);
            var service = scope.ServiceProvider.GetRequiredService<INotificationTasksService>();
           
            await service.DailyUnassignedClassesNotification();
            await service.DailyChildrenRegistrationsIncompleteNotification();
            await service.DailyChildrenNotAssignedToClassNotification();
            await service.DailyUnassignedProgrammesNotification();
            //await service.Daily3WeekLogonCheck(); //deprecated
        }
    }
}
