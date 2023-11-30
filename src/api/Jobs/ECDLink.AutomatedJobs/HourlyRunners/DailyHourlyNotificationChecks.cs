using ECDLink.AutomatedJobs.Anonymise;
using ECDLink.AutomatedJobs.Cron;
using ECDLink.AutomatedJobs.Util;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.HourlyRunners;

public class DailyHourlyNotificationChecks : CronJobService
{
    private readonly IServiceScopeFactory _scopeFactory;
    public DailyHourlyNotificationChecks(IServiceScopeFactory scopeFactory, CronJobConfig<DailyHourlyNotificationChecks> config, ILogger<DailyHourlyNotificationChecks> logger)
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


        }
    }
}
