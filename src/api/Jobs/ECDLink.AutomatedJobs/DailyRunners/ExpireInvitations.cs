using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.DailyRunners;

public class ExpireInvitations : CronJobService
{
    public ExpireInvitations(IServiceScopeFactory scopeFactory, CronJobConfig<ExpireInvitations> config, ILogger<ExpireInvitations> logger)
            : base(scopeFactory, config, logger)
    {
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        var service = GetRequiredService<IReassignmentService>();
        service.ExpireRelationshipLinks();
    }
}
