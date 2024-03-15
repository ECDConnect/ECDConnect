using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.DailyRunners;

public class DailyNotificationChecks : CronJobService
{
    public DailyNotificationChecks(IServiceScopeFactory scopeFactory, CronJobConfig<DailyNotificationChecks> config, ILogger<DailyNotificationChecks> logger)
            : base(scopeFactory, config, logger)
    {
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        var service = GetRequiredService<INotificationTasksService>();
        await service.DailyUserOfflineNotification();
    }
}
