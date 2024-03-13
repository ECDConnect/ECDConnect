using ECDLink.AutomatedJobs.Cron;
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
        public ClubChildProgressPointsCalculation(IServiceScopeFactory scopeFactory, CronJobConfig<ClubChildProgressPointsCalculation> config, ILogger<ClubChildProgressPointsCalculation> logger)
                : base(scopeFactory, config, logger)
        {
        }

        public override async Task DoWork(CancellationToken cancellationToken)
        {
            var service = GetRequiredService<IPointsService>();

            // Runs June-July and Nov-Dec(20) CRON handles months, we just need to stop after Dec 20
            if (DateTime.Now.Month != 12 || DateTime.Now.Day <= 20)
            {
                service.CalculateCompleteChildProgressReports();
                service.CalculateCompleteCaregiverReportBack();
            }
        }
    }
}