using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.DailyRunners;

public class YearlyNotificationChecks : CronJobService
{
    public YearlyNotificationChecks(IServiceScopeFactory scopeFactory, CronJobConfig<YearlyNotificationChecks> config, ILogger<YearlyNotificationChecks> logger)
            : base(scopeFactory, config, logger)
    {
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        //var service = Scope.ServiceProvider.GetRequiredService<INotificationTasksService>();
        //await service.DailyAttendanceNotTrackedNotification();
    }
}
