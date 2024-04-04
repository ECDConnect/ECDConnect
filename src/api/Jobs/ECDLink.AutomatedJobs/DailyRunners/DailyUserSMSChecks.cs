using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.DailyRunners;

public class DailyUserSMSChecks : CronJobService
{
    public DailyUserSMSChecks(IServiceScopeFactory scopeFactory, CronJobConfig<DailyUserSMSChecks> config, ILogger<DailyUserSMSChecks> logger)
            : base(scopeFactory, config, logger)
    {
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        var service = GetRequiredService<INotificationTasksService>();

        await service.DailyUserOfflineNotification();
    }
}
