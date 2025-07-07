using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.DailyRunners;

/// <summary>
/// Removes any practitioners who have been scheduled for removal by their principal
/// </summary>
public class RemovePractitioners : CronJobService
{
    public RemovePractitioners(IServiceScopeFactory scopeFactory, CronJobConfig<RemovePractitioners> config, ILogger<RemovePractitioners> logger)
            : base(scopeFactory, config, logger)
    {
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        var service = GetRequiredService<IAutomatedProcessService>();

        service.ProcessPractitionerRemovals();
    }
}
