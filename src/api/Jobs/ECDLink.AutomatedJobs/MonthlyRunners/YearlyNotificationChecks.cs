using ECDLink.AutomatedJobs.Cron;
using ECDLink.AutomatedJobs.Util;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.DailyRunners;

public class YearlyNotificationChecks : CronJobService
{
    private readonly IServiceScopeFactory _scopeFactory;
    public YearlyNotificationChecks(IServiceScopeFactory scopeFactory, IScheduleConfig<YearlyNotificationChecks> config)
        : base(config.CronExpression, config.TimeZoneInfo)
    {
        _scopeFactory = scopeFactory;
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        using (var scope = _scopeFactory.CreateScope())
        {
            var service = scope.ServiceProvider.GetRequiredService<INotificationTasksService>();

            TenancyContext.SetTenantContext(scope);

            //await service.DailyAttendanceNotTrackedNotification();

        }
    }
}
