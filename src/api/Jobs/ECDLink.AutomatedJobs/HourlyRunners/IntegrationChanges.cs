using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection; 
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace ECDLink.AutomatedJobs.DailyRunners;

public class IntegrationChanges : CronJobService
{
    public IntegrationChanges(IServiceScopeFactory scopeFactory, CronJobConfig<IntegrationChanges> config, ILogger<IntegrationChanges> logger)
            : base(scopeFactory, config, logger)
    {
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        // var service = GetRequiredService<IIntegrationService>();
        // if (service != null && service.Enabled)
        // {
        //     await service.IntegrationUpdates();
        // }
    }
}
