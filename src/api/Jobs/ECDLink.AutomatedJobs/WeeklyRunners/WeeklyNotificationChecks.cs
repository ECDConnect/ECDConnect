using ECDLink.AutomatedJobs.Cron;
using ECDLink.AutomatedJobs.Util;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.DailyRunners;

public class WeeklyNotificationChecks : CronJobService
{
    private readonly IServiceScopeFactory _scopeFactory;
    public WeeklyNotificationChecks(IServiceScopeFactory scopeFactory, IScheduleConfig<WeeklyNotificationChecks> config)
        : base(config)
    {
        _scopeFactory = scopeFactory;
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        using (var scope = _scopeFactory.CreateScope())
        {
            var service = scope.ServiceProvider.GetRequiredService<INotificationTasksService>();

            TenancyContext.SetTenantContext(scope);

            if (DateTime.Now.Hour >= 4)
            { //run weekly attendance reminder
                await service.WeeklyAttendancesReminderAsync();
            }
            await service.WeeklyCoachTraineesCheckReminderAsync();
        }
    }
}
