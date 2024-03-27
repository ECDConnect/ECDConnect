using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.MonthlyRunners;

public class ClubChildAttendanceCalculation : CronJobService
{
    public ClubChildAttendanceCalculation(IServiceScopeFactory scopeFactory, CronJobConfig<ClubChildAttendanceCalculation> config, ILogger<ClubChildAttendanceCalculation> logger)
            : base(scopeFactory, config, logger)
    {
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        var service = Scope.ServiceProvider.GetRequiredService<IPointsService>();
        service.CalculateClubChildAttendance();
    }
}
