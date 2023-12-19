using ECDLink.AutomatedJobs.Cron;
using ECDLink.AutomatedJobs.Util;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.DailyRunners
{
    public class ClubLeaveNoOneBehindPointsCalculation : CronJobService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        public ClubLeaveNoOneBehindPointsCalculation(
            IServiceScopeFactory scopeFactory,
            CronJobConfig<ClubLeaveNoOneBehindPointsCalculation> config,
            ILogger<ClubLeaveNoOneBehindPointsCalculation> logger)
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

                // Runs every day until december, will recalculate and update the rating for each club
                service.CalculateLeaveNoOneBehind();
            }
        }
    }
}
