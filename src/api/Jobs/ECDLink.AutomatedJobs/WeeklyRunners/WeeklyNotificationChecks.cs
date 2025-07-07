using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.DailyRunners;

public class WeeklyNotificationChecks : CronJobService
{
    public WeeklyNotificationChecks(IServiceScopeFactory scopeFactory, CronJobConfig<WeeklyNotificationChecks> config, ILogger<WeeklyNotificationChecks> logger)
            : base(scopeFactory, config, logger)
    {
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        var service = Scope.ServiceProvider.GetRequiredService<INotificationTasksService>();

        //run weekly attendance reminder
        //await service.WeeklyAttendancesReminderAsync();
    }
}
