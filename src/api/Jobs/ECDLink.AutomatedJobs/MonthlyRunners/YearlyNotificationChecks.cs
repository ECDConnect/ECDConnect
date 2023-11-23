using ECDLink.AutomatedJobs.Anonymise;
using ECDLink.AutomatedJobs.Cron;
using ECDLink.AutomatedJobs.Util;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.DailyRunners;

public class YearlyNotificationChecks : CronJobService
{
    private readonly IServiceScopeFactory _scopeFactory;
    public YearlyNotificationChecks(IServiceScopeFactory scopeFactory, CronJobConfig<YearlyNotificationChecks> config, ILogger<YearlyNotificationChecks> logger)
            : base(config, logger)
    {
        _scopeFactory = scopeFactory;
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        using (var scope = _scopeFactory.CreateScope())
        {
            var service = scope.ServiceProvider.GetRequiredService<INotificationTasksService>();

            TenancyContext.SetTenantContext(scope);

            //await service.DailyAttendanceNotTrackedNotification();

        }
    }
}
