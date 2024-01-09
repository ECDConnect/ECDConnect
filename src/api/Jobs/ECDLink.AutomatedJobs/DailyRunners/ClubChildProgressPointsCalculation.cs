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
    public class ClubChildProgressPointsCalculation : CronJobService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        public ClubChildProgressPointsCalculation(IServiceScopeFactory scopeFactory, CronJobConfig<ClubChildProgressPointsCalculation> config, ILogger<ClubChildProgressPointsCalculation> logger)
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

                // Runs June-July and Nov-Dec(20) CRON handles months, we just need to stop after Dec 20
                if (DateTime.Now.Month != 12 || DateTime.Now.Day <= 20)
                {
                    service.CalculateCompleteChildProgressReports();
                    service.CalculateCompleteCaregiverReportBack();
                }
            }
        }
    }
}