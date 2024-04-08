using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.MonthlyRunners;

public class CalculateInfantVisitsCompletedPoints : CronJobService
{
    public CalculateInfantVisitsCompletedPoints(IServiceScopeFactory scopeFactory, CronJobConfig<CalculateInfantVisitsCompletedPoints> config, ILogger<CalculateInfantVisitsCompletedPoints> logger)
            : base(scopeFactory, config, logger)
    {
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        var service = GetRequiredService<IGrowGreatPointsCalculationsService>();
        service.CalculateInfantVisitsCompletedPoints();
    }
}
