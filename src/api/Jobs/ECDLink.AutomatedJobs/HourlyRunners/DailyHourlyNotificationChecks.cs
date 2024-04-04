using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.HourlyRunners;

public class DailyHourlyNotificationChecks : CronJobService
{
    public DailyHourlyNotificationChecks(IServiceScopeFactory scopeFactory, CronJobConfig<DailyHourlyNotificationChecks> config, ILogger<DailyHourlyNotificationChecks> logger)
            : base(scopeFactory, config, logger)
    {
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        //var service = GetRequiredService<INotificationTasksService>();
    }
}
