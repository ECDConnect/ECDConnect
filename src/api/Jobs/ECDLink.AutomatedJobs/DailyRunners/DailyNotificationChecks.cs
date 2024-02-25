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

namespace ECDLink.AutomatedJobs.DailyRunners;

public class DailyNotificationChecks : CronJobService
{
    private readonly IServiceScopeFactory _scopeFactory;
    public DailyNotificationChecks(IServiceScopeFactory scopeFactory, CronJobConfig<DailyNotificationChecks> config, ILogger<DailyNotificationChecks> logger)
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

            await service.DailyUserOfflineNotification();
            await service.DailyUnassignedClassesNotification();
            await service.DailyChildrenRegistrationsIncompleteNotification();
            await service.DailyChildrenNotAssignedToClassNotification();
            ////await service.DailyUnassignedProgrammesNotification();
            await service.SelfAssessmentReminderNewAsync();

            await service.CoachChecksNotification();

            //await service.MonthlyStartupSupportEndReminderAsync(); //not complete until the startup support enddates are available

            //specific day checks in year/month
            if (DateTime.Now.Day == 15 && DateTime.Now.Month == 1) //15 Jan each year only
            {
                await service.YearlyPreschoolFeeReminderAsync();
            }

            if (DateTime.Now.Day == (DateTime.Now.GetEndOfMonth().Day - 10))
            {
                await service.MonthlyEarnMorePointsNotification();
            }
        }
    }
}
