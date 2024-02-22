using ECDLink.AutomatedJobs.Cron;
using ECDLink.AutomatedJobs.Util;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.DailyRunners;

public class WeeklyNotificationChecks : CronJobService
{
    private readonly IServiceScopeFactory _scopeFactory;
    public WeeklyNotificationChecks(IServiceScopeFactory scopeFactory, CronJobConfig<WeeklyNotificationChecks> config, ILogger<WeeklyNotificationChecks> logger)
            : base(config, logger)
    {
        _scopeFactory = scopeFactory;
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        using (var scope = _scopeFactory.CreateScope())
        {
            TenancyContext.SetTenantContext(scope);
            var service = scope.ServiceProvider.GetRequiredService<INotificationTasksService>();

             //run weekly attendance reminder
            await service.WeeklyAttendancesReminderAsync();
            await service.CoachChecksNotification(true);
            await service.WeeklyCoachTraineesCheckReminderAsync();
        }
    }
}
