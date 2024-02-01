using ECDLink.AutomatedJobs.Anonymise;
using ECDLink.AutomatedJobs.Cron;
using ECDLink.AutomatedJobs.Util;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.MonthlyRunners;

public class MonthlyNotificationChecks : CronJobService
{
    private readonly IServiceScopeFactory _scopeFactory;
    public MonthlyNotificationChecks(IServiceScopeFactory scopeFactory, CronJobConfig<MonthlyNotificationChecks> config, ILogger<MonthlyNotificationChecks> logger)
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
            if (DateTime.Now.Day == 1)
            { //only run on 1st of month
                await service.MonthlyStatementsReminderAsync();
                await service.MonthlyTopPointsEarnerNotification();
                //specific months checks
                if (DateTime.Now.Month == 7)
                {
                    await service.ProgressReportsReminderAsync();
                }
                if (DateTime.Now.Month == 12)
                {
                    await service.ProgressReportsReminderAsync();
                    await service.YearlyPointsSummaryNotification();
                }
            }

            //if the first sunday in the month, run weekly attendance PDFs
            if (DateTime.Now.DayOfWeek == DayOfWeek.Sunday && DateTime.Now.Day <= 7)
            {
                await service.MonthlyAttendanceSLSyncAsync();
            }
        }
    }
}
