using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.DailyRunners;

public class RevertReassignment : CronJobService
{
    public RevertReassignment(IServiceScopeFactory scopeFactory, CronJobConfig<RevertReassignment> config, ILogger<RevertReassignment> logger)
            : base(scopeFactory, config, logger)
    {
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        var service = GetRequiredService<IReassignmentService>();
        service.ReassignAbsentees();
    }
}
