using ECDLink.AutomatedJobs.Cron;
using ECDLink.AutomatedJobs.Util;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.BiannualRunners;

public class ClubPointsCalculation : CronJobService
{
    private readonly IServiceScopeFactory _scopeFactory;
    public ClubPointsCalculation(IServiceScopeFactory scopeFactory, IScheduleConfig<ClubPointsCalculation> config)
        : base(config.CronExpression, config.TimeZoneInfo)
    {
        _scopeFactory = scopeFactory;
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        using (var scope = _scopeFactory.CreateScope())
        {
            TenancyContext.SetTenantContext(scope);
            var service = scope.ServiceProvider.GetRequiredService<IPointsService>();

            if (DateTime.Now.Month == 7 && DateTime.Now.Day == 31)
            {
                service.CalculateCompleteChildProgressReports(DateTime.Now);
            } else if (DateTime.Now.Month == 11 && DateTime.Now.Day == 30)
            {
                service.CalculateCompleteChildProgressReports(DateTime.Now);
                service.CalculateLeaveNoOneBehind(DateTime.Now);
            }
           
        }
    }
}
