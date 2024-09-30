using ECDLink.AutomatedJobs.Cron;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.MonthlyRunners;

public class MonthlyNotificationChecks : CronJobService
{
    public MonthlyNotificationChecks(IServiceScopeFactory scopeFactory, CronJobConfig<MonthlyNotificationChecks> config, ILogger<MonthlyNotificationChecks> logger)
            : base(scopeFactory, config, logger)
    {
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
       /* if (DateTime.Now.Day == 1)
        { //only run on 1st of month
            var service = GetRequiredService<INotificationTasksService>();
            await service.MonthlyTopPointsEarnerNotification();
            if (DateTime.Now.Month == 12)
            {
                await service.YearlyPointsSummaryNotification();
            }
        }*/
    }
}
