using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.DailyRunners
{
    public class ClubLeaveNoOneBehindPointsCalculation : CronJobService
    {
        public ClubLeaveNoOneBehindPointsCalculation(
            IServiceScopeFactory scopeFactory,
            CronJobConfig<ClubLeaveNoOneBehindPointsCalculation> config,
            ILogger<ClubLeaveNoOneBehindPointsCalculation> logger)
                : base(scopeFactory, config, logger)
        {
        }

        public override async Task DoWork(CancellationToken cancellationToken)
        {
            var service = GetRequiredService<IPointsService>();

            // Runs every day until december, will recalculate and update the rating for each club
            service.CalculateLeaveNoOneBehind();
        }
    }
}
