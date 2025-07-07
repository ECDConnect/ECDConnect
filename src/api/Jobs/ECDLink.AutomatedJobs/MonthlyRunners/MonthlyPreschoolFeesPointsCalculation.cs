using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.MonthlyRunners;

public class MonthlyPreschoolFeesPointsCalculation : CronJobService
{
    public MonthlyPreschoolFeesPointsCalculation(
        IServiceScopeFactory scopeFactory, 
        CronJobConfig<MonthlyPreschoolFeesPointsCalculation> config, 
        ILogger<MonthlyPreschoolFeesPointsCalculation> logger)
            : base(scopeFactory, config, logger)
    {
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        
        if (DateTime.Now.Day == DateTime.Now.GetEndOfMonth().Day)
        {
            var service = GetRequiredService<IPointsService>();
            service.CalculatePreschoolFeesGreaterThan0ForEachChild();
        }
    }
}

