using ECDLink.AutomatedJobs.Cron;
using ECDLink.AutomatedJobs.Util;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.MonthlyRunners;

public class MonthlyNotificationChecks : CronJobService
{
    private readonly IServiceScopeFactory _scopeFactory;
    public MonthlyNotificationChecks(IServiceScopeFactory scopeFactory, IScheduleConfig<MonthlyNotificationChecks> config)
        : base(config.CronExpression, config.TimeZoneInfo)
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
                await service.MonthlyStartupSupportEndReminderAsync();

                //specific months checks
                if (DateTime.Now.Month == 7)
                {
                    await service.ProgressReportsReminderAsync();
                }
                if (DateTime.Now.Month == 12)
                {
                    await service.ProgressReportsReminderAsync();
                }                                
            }

        }
    }
}
