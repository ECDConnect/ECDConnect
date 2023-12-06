using ECDLink.AutomatedJobs.BiannualRunners;
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

public class ClubChildAttendanceCalculation : CronJobService
{
    private readonly IServiceScopeFactory _scopeFactory;
    public ClubChildAttendanceCalculation(IServiceScopeFactory scopeFactory, CronJobConfig<ClubChildAttendanceCalculation> config, ILogger<ClubChildAttendanceCalculation> logger)
            : base(config, logger)
    {
        _scopeFactory = scopeFactory;
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        using (var scope = _scopeFactory.CreateScope())
        {
            TenancyContext.SetTenantContext(scope);
            var service = scope.ServiceProvider.GetRequiredService<IPointsService>();

            if (DateTime.Now.Date == DateTime.Now.GetStartOfMonth().Date)
            {
                service.CalculateClubChildAttendance();
            }
        }
    }
}
